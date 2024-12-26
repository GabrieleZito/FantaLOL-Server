const fs = require("fs");
const db = require("../database.js");

module.exports = function (io) {
    //leadId => [{username, userId}, {}, ...]
    let users = new Map();
    let auctionTimers = new Map();
    //leadId => [{id, name...}, {}]
    let players = new Map();

    io.on("connection", (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);
        socket.on("disconnect", () => {
            console.log("🔥: " + socket.data.username + " disconnected");
        });

        socket.on("joinAsta", (data, setUsers) => {
            //console.log(data);
            const leadId = data.leadId;
            const username = data.username;
            const userId = data.userId;
            //console.log(leadId);

            socket.join(leadId);
            socket.data.username = username;
            socket.data.userId = userId;

            if (users.get(leadId) === undefined) {
                users.set(leadId, [{ username, userId }]);
                file = fs.readFileSync(__dirname + "/../liquipedia/lec_players.json");
                file = JSON.parse(file);

                players.set(leadId, file.data);
                //console.log(players);

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
            //console.log(users);
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
            //console.log("dentro check auctions");

            const auction = await db.getCurrentAuction(leadId);
            if (auction) {
                io.in(leadId).emit("newPlayer", auction);
                const timer = auctionTimers.get(auction.id);
                io.in(leadId).emit("timer:sync", timer.getRemainingTime());
            } else {
                io.in(leadId).emit("newPlayer", null);
            }
        });

        socket.on("nextPlayer", async (leadId) => {
            //TODO calcolare le aste che mancano prendendo quelle nel db
            const nextPlayer = players.get(leadId).shift();
            //console.log(nextPlayer);
            const player = await db.newPlayer(nextPlayer);
            const auction = await db.newAuction(Date.now(), Date.now() + 120000, player.id, leadId);
            auction.dataValues.bids = [];
            auction.dataValues.Player = nextPlayer;
            //console.log(auction.dataValues);
            const timer = new AuctionTimer(io, auction.id, leadId);
            auctionTimers.set(auction.id, timer);
            timer.start();

            io.in(leadId).emit("newPlayer", auction.dataValues);
        });

        //TODO controllo sui punti dell'utente
        //TODO controllare se l'offerta è valida
        //TODO aggiungere controlli segnati sul client
        socket.on("bid", async (leadId, bid, error) => {
            const userId = socket.data.userId;
            let coins = await db.getUserCoins(userId, leadId);
            coins = coins.dataValues.Partecipate[0].Partecipations.coins;
            //console.log(coins);
            //console.log(bid);

            //TODO altri controlli
            if (bid > coins) {
                error("Not enough coins");
            } else {
                const auction = await db.getCurrentAuction(leadId);
                //console.log(auction);
                //console.log(auction.id);
                const max = await db.getMaxBid(auction.id);
                console.log(max);
                //bids.forEach((b) => console.log(b));
                if (max > 0 && bid < max) {
                    error("Bid Too Low");
                } else {
                    console.log("bid " + bid);
                    //console.log("dentro else");
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
            //console.log(players);
        });
    });

    class AuctionTimer {
        constructor(io, auctionId, leadId) {
            this.io = io;
            this.auctionId = auctionId;
            this.duration = 1 * 60; // 2 minutes in seconds
            this.endTime = null;
            this.timer = null;
            this.leadId = leadId;
        }

        start() {
            console.log("dentro start timer");

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
                auctionId: auction.currentBid,
            });

            auctionTimers.delete(this.auctionId);
        }

        getRemainingTime() {
            if (!this.endTime) return 0;
            return Math.max(0, this.endTime - Date.now());
        }
    }
};
