const fs = require("fs");
const db = require("../database.js");

module.exports = function (io) {
    //leadId => [{username, userId}, {}, ...]
    let users = new Map();
    //leadId => [{time, idPlayer, bid, userId, username}]
    let bids = new Map();
    //leadId => [{startTime, idPlayer, currentBid, currentBidder, status}]
    let auctions = new Map();
    //leadId => [{id, name...}, {}]
    let players = new Map();

    io.on("connection", (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);
        socket.on("disconnect", () => {
            console.log("🔥: A user disconnected");
            //TODO da togliere
            users.clear();
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

        //TODO controllare prima auction per vedere se ce n'è in corso
        socket.on("startAsta", (leadId, cb) => {
            const first = players.get(leadId).shift();
            asta(leadId, first);

            cb(first);
            socket.to(leadId).emit("newPlayer", first);
        });

        //TODO controllo sui punti dell'utente
        //TODO controllare se l'offerta è valida
        //TODO aggiungere controlli segnati sul client
        socket.on("bid", (leadId, bid, cb) => {
            let auction;
            if (auctions.has(leadId)) {
                auction = auctions.get(leadId).filter((a) => a.status == "ongoing")[0];
                console.log("Auction:");

                console.log(auction);
            } else {
                //TODO gestire errore
                console.error("ERRORE");
            }
            if (bids.has(leadId)) {
                bids.get(leadId).push({
                    time: Date.now(),
                    idPlayer: auction.player,
                    bid: bid,
                    userId: socket.data.userId,
                    username: socket.data.username,
                });

                //aggiorna l'asta
                const a = auctions.get(leadId);
                const i = a.findIndex((item) => item.player == auction.player);
                a[i] = { ...a[i], currentBid: bid, currentBidder: socket.data.userId };
                auctions.set(leadId, a);

                //manda agli utenti la lista delle offerte
                const bidsToSend = bids
                    .get(leadId)
                    .filter((b) => b.idPlayer == auction.player)
                    .sort((a, b) => b.bid - a.bid);
                cb(bidsToSend);
                socket.in(leadId).emit("newBid", bidsToSend);
            }
        });

        socket.on("show", () => {
            console.log(users);
            console.log(bids);
            console.log(auctions);
            //console.log(players);
        });

        //TODO gestire invio dati se qualcuno entra mid-asta
        const asta = (leadId, player) => {
            auctions.set(leadId, [
                {
                    startTime: Date.now(),
                    endTime: Date.now() + 61000,
                    currentBid: 0,
                    currentBidder: null,
                    status: "ongoing",
                    player: player.id,
                },
            ]);
            bids.set(leadId, []);
            astaCountdown(leadId, player.id);
        };
        const astaCountdown = (leadId, player) => {
            let endTime;
            if (auctions.has(leadId)) {
                //TODO questo controllo fa un po' cagare
                auctions.get(leadId).forEach((a) => {
                    if (a.player == player) {
                        endTime = a.endTime;
                    }
                });
                console.log("inizio timer");

                const interval = setInterval(() => {
                    //console.log("endTime: " + endTime);

                    const remainingTime = endTime - Date.now();
                    if (remainingTime <= 0) {
                        clearInterval(interval);
                        console.log("timer finito " + leadId);

                        const a = auctions.get(leadId);
                        const i = a.findIndex((item) => item.player == player && item.status == "ongoing");
                        a[i] = { ...a[i], status: "closed" };
                        auctions.set(leadId, a);

                        db.assignPlayer(leadId, a[i].currentBidder, player);
                        io.in(leadId).emit("endedAsta", a[i].currentBidder);
                    } else {
                        //console.log(`Leaderboard ${leadId}: ${remainingTime} ms remaining`);
                    }
                }, 500);
            } else throw Error("L'asta non esiste");
        };
    });
};
