const fs = require("fs");
const db = require("../database.js");
const { getPlayerFromJson } = require("../utils/misc.js");

module.exports = function (io) {
    //leadId => [{username, userId}, {}, ...]
    let users = new Map();
    let auctionTimers = new Map();

    io.on("connection", (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);
        socket.on("disconnect", () => {
            console.log("🔥: " + socket.data.username + " disconnected");
        });

        socket.on("joinAsta", (data, setUsers) => {
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

        socket.on("nextPlayer", async (leadId) => {
            const closedAuctions = await db.getClosedAuctions(leadId);
            const closedPlayers = await Promise.all(
                closedAuctions.map(async (a) => {
                    const p = await db.getPlayerById(a.PlayerId);
                    return p;
                })
            );
            const allPlayers = await db.getPlayers();

            const existingIds = new Set(closedPlayers.map((p) => p.name));
            const missingPlayers = allPlayers.filter((player) => !existingIds.has(player.name));
            if (missingPlayers.length > 0) {
                const player2 = missingPlayers.shift();
                missingPlayers.forEach((m) => console.log(m.name));

                const auction = await db.newAuction(Date.now(), Date.now() + 120000, player2.id, leadId);
                auction.dataValues.bids = [];
                auction.dataValues.Player = getPlayerFromJson(player2.name);
                const timer = new AuctionTimer(io, auction.id, leadId);
                auctionTimers.set(auction.id, timer);
                timer.start();

                io.in(leadId).emit("newPlayer", auction.dataValues);
            } else {
                io.in(leadId).emit("newPlayer", null);
            }
        });

        //TODO controllo sui punti dell'utente
        //TODO controllare se l'offerta è valida
        //TODO aggiungere controlli segnati sul client
        socket.on("bid", async (leadId, bid, error) => {
            const userId = socket.data.userId;
            let coins = await db.getUserCoins(userId, leadId);
            coins = coins.dataValues.Partecipate[0].Partecipations.coins;

            //TODO altri controlli
            if (bid > coins) {
                error("Not enough coins");
            } else {
                const auction = await db.getCurrentAuction(leadId);

                const max = await db.getMaxBid(auction.id);
                //console.log(max);
                if (max > 0 && bid < max) {
                    error("Bid Too Low");
                } else {
                    console.log("bid " + bid);
                    const Bid = await db.newBid(bid, userId, auction.id);
                    const bids = await db.getBidsForAuction(auction.id);
                    await db.updateAuction(auction.id, bid, userId);
                    io.to(leadId).emit("newBid", bids.reverse());
                }
            }
        });

        socket.on("show", () => {
            console.log(users);
            //console.log(auctions);
            console.log(players.get(1).length);
        });
    });

    class AuctionTimer {
        constructor(io, auctionId, leadId) {
            this.io = io;
            this.auctionId = auctionId;
            //TODO cambiare a 1 minuto
            this.duration = 1 * 60;
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

            this.io.to(this.leadId).emit("timer:end", {
                auctionId: auction,
            });

            auctionTimers.delete(this.auctionId);
        }

        getRemainingTime() {
            if (!this.endTime) return 0;
            return Math.max(0, this.endTime - Date.now());
        }
    }
};
