const fs = require("fs");
const db = require("../database.js");
const { getPlayerById } = require("../utils/api.js");

module.exports = function (io) {
    //leadId => [{username, userId}, {}, ...]
    let users = new Map();
    let auctionTimers = new Map();

    io.on("connection", (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);
        socket.on("disconnect", () => {
            console.log("🔥: " + socket.data.username + " disconnected");
        });

        socket.on("joinAsta", async (data, setUsers) => {
            const leadId = data.leadId;
            const username = data.username;
            const userId = data.userId;

            socket.join(leadId);
            socket.data.username = username;
            socket.data.userId = userId;

            if (users.get(leadId) === undefined) {
                users.set(leadId, [{ username, userId }]);
                setUsers(users.get(leadId));
                socket.to(leadId).emit("userJoined", { username, userId });
            } else {
                let duplicate = false;
                for (let i = 0; i < users.get(leadId).length; i++) {
                    const e = users.get(leadId)[i];
                    if (e.userId === userId) {
                        duplicate = true;
                    }
                }
                if (!duplicate) {
                    users.get(leadId).push({ username, userId });
                    setUsers(users.get(leadId));
                    socket.to(leadId).emit("userJoined", { username, userId });
                }
            }
            const team = await db.getUserTeam(userId, leadId);
            io.to(socket.id).emit("team", team);
        });

        socket.on("leaveAsta", (data) => {
            const leadId = data.leadId;
            const userId = data.userId;
            if (users.has(leadId)) {
                users.set(
                    leadId,
                    users.get(leadId).filter((e) => e.userId !== userId)
                );
                socket.leave(leadId);
                socket.to(leadId).emit("userLeft", userId);
            }
        });

        socket.on("checkAuctions", async (leadId) => {
            const auction = await db.getCurrentAuction(leadId);
            if (auction) {
                io.in(leadId).emit("newPlayer", auction);
                //TODO gestire il caso in cui non esista il timer
                const timer = auctionTimers.get(auction.id);
                io.in(leadId).emit("timer:sync", timer.getRemainingTime());
            } else {
                io.in(leadId).emit("newPlayer", null);
            }
        });

        //TODO saltare le aste se tutti gli utenti hanno il team completo per quel ruolo
        socket.on("nextPlayer", async (leadId) => {
            const closedAuctions = await db.getClosedAuctions(leadId);
            const closedPlayers = await Promise.all(
                closedAuctions.map(async (a) => {
                    const p = await db.getPlayerById(a.PlayerId);
                    return p;
                })
            );
            const allPlayers = await db.getPlayersForLeaderboard(leadId);

            const existingIds = new Set(closedPlayers.map((p) => p.name));
            const missingPlayers = allPlayers.filter((player) => !existingIds.has(player.name));
            if (missingPlayers.length > 0) {
                missingPlayers.sort((a, b) => (a.role > b.role ? 1 : b.role > a.role ? -1 : 0));

                const player2 = missingPlayers.shift();
                //missingPlayers.forEach((m) => console.log(m.name));

                const auction = await db.newAuction(Date.now(), Date.now() + 120000, player2.id, leadId);
                auction.dataValues.bids = [];
                auction.dataValues.Player = await getPlayerById(player2.name);
                const timer = new AuctionTimer(io, auction.id, leadId);
                auctionTimers.set(auction.id, timer);
                timer.start();

                io.in(leadId).emit("newPlayer", auction.dataValues);
            } else {
                io.in(leadId).emit("newPlayer", null);
            }
        });

        socket.on("bid", async (leadId, bid, message) => {
            const userId = socket.data.userId;
            let coins = await db.getUserCoins(userId, leadId);
            coins = coins.dataValues.Partecipate[0].Partecipations.coins;

            //non abbastanza monete
            if (bid > coins) {
                message({ success: false, error: "Not Enough Coins" });
            } else {
                const auction = await db.getCurrentAuction(leadId);
                const max = await db.getMaxBid(auction.id);
                //puntata più bassa delle altre
                if (max > 0 && bid < max) {
                    message({ success: false, error: "Bid Too Low" });
                } else {
                    let team = await db.getUserTeam(socket.data.userId, leadId);
                    team = team.Team.Players;
                    //console.log(team);

                    if (coins - bid + 1 < 10 - team.length) {
                        message({ success: false, error: "Save some coins for the other players" });
                    } else {
                        //console.log(auction);

                        const role = auction.Player.extradata.role;
                        //console.log(role);

                        const rolePlayers = team.filter((p) => p.role == role);
                        //console.log(rolePlayers);

                        if (rolePlayers.length >= 2) {
                            message({ success: false, error: "You reached the limit for this role" });
                        } else {
                            console.log("bid " + bid);
                            const Bid = await db.newBid(bid, userId, auction.id);
                            const bids = await db.getBidsForAuction(auction.id);
                            await db.updateAuction(auction.id, bid, userId);
                            message({ success: true, error: "" });
                            io.to(leadId).emit("newBid", bids.reverse());
                        }
                    }
                }
            }
        });

        socket.on("getTeam", async (leadId) => {
            const team = await db.getUserTeam(socket.data.userId, leadId);
            io.to(socket.id).emit("team", team);
        });

        socket.on("show", async () => {
            //console.log(users);
            //console.log(auctions);
            //console.log(players.get(1).length);
            const c = await db.getUserTeam(1, 1);
            //console.log(c);
            io.to(socket.id).emit("prova", c);
        });
    });

    class AuctionTimer {
        constructor(io, auctionId, leadId) {
            this.io = io;
            this.auctionId = auctionId;
            //TODO cambiare a 1 minuto
            this.duration = 1 * 10;
            this.endTime = null;
            this.timer = null;
            this.leadId = leadId;
        }

        start() {
            //console.log("dentro start timer");

            this.endTime = Date.now() + this.duration * 1000;

            // Emit initial time to all clients in the auction room
            this.io.to(this.leadId).emit("timer:start", {
                remainingTime: this.getRemainingTime(),
            });

            // Set server timer
            this.timer = setTimeout(async () => {
                await this.endAuction();
            }, this.duration * 1000);
        }

        async endAuction() {
            clearTimeout(this.timer);
            const auction = await db.endAuction(this.auctionId);
            //console.log(auction);

            this.io.to(this.leadId).emit("timer:end", {
                winner: auction ? auction.UserProfileId : "",
            });

            auctionTimers.delete(this.auctionId);
        }

        getRemainingTime() {
            if (!this.endTime) return 0;
            return Math.max(0, this.endTime - Date.now());
        }
    }
};
