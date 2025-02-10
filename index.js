const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const db = require("./database.js");
const fs = require("fs");

const { getDayMatches, getGamesFromMatchId, getTeamsFromGameId, getPlayerFromGameId } = require("./utils/api.js");

//DATABASE
const sequelize = require("./config/sequelize.js");
sequelize.sync({ force: false }).then(async () => {
    console.log("DB connected");
});

const passport = require("passport");
require("./strategies/local-strategy.js");

//ROUTES
const authRouter = require("./routes/auth.js");
const leagueRouter = require("./routes/league.js");
const usersRouter = require("./routes/users.js");
const leadRouter = require("./routes/leaderboards.js");

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.set("trust proxy", 1);
app.use(
    cors({
        origin: ["https://admin.socket.io", process.env.CLIENT_URL],
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        proxy: true,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/league", leagueRouter);
app.use("/users", usersRouter);
app.use("/leaderboards", leadRouter);

app.get("/prova", async (req, res) => {
    const p = await checkPoints();
    res.json(p);
});

const checkPoints = async () => {
    const matches = await getInfoMatches();
    let points = [];
    if (matches && matches.length > 0) {
        for (let i = 0; i < matches.length; i++) {
            const m = matches[i];
            if (m.MVP) {
                const mvp = await db.setPoints("MVP", m.MVP);
                points.push(mvp);
            }
            for (let j = 0; j < m.Games.length; j++) {
                const g = m.Games[j];
                if (g.MVP) {
                    const mvp = await db.setPoints("MVP", g.MVP);
                    points.push(mvp);
                }
                for (let k = 0; k < g.Teams.length; k++) {
                    const t = g.Teams[k];
                    //TODO spazio per eventualmente punti della squadra
                    for (let x = 0; x < t.Players.length; x++) {
                        const p = t.Players[x];
                        const kills = await db.setPoints("Kills", p.Name, parseInt(p.Kills));
                        points.push(kills);
                        const gold = await db.setPoints("Gold", p.Name, parseInt(p.Gold));
                        points.push(gold);
                        const cs = await db.setPoints("CS", p.Name, parseInt(p.CS));
                        points.push(cs);
                        const damage = await db.setPoints("Damage", p.Name, parseInt(p.DamageToChampions));
                        points.push(damage);
                        const vision = await db.setPoints("Vision", p.Name, parseInt(p.VisionScore));
                        points.push(vision);
                    }
                }
            }
        }
    }
    return points;
};

const getInfoMatches = async () => {
    const leads = await db.getLeaderboards();
    let allMatches = [];
    for (let i = 0; i < leads.length; i++) {
        const e = leads[i];

        let tournaments = await db.getLeaderboardTournaments(e.id);
        //console.log(tournaments.Tournaments);

        tournaments = tournaments.Tournaments.map((t) => t.OverviewPage);
        //console.log(tournaments);

        let matches = [];
        for (let i = 0; i < tournaments.length; i++) {
            const t = tournaments[i];
            //console.log(t)
            let res = await getDayMatches(t);
            if (res.length > 0) {
                res = res.map((t) => t.title);
                matches.push(res);
            }
        }
        matches = matches.flat();
        matches = await Promise.all(
            matches.map(async (m) => {
                let games = await getGamesFromMatchId(m.MatchId);
                games = games.map((g) => g.title);
                games = await Promise.all(
                    games.map(async (g) => {
                        let teams = await getTeamsFromGameId(g.GameId);
                        teams = teams.map((t) => t.title);
                        g.Teams = teams;
                        teams = await Promise.all(
                            teams.map(async (t) => {
                                let players = await getPlayerFromGameId(t.GameId);
                                players = players.map((p) => p.title);
                                t.Players = players;
                                return t;
                            })
                        );
                        return g;
                    })
                );
                m.Games = games;
                return m;
            })
        );
        //console.log(matches);
        if (matches.length > 0) {
            //console.log("DENTRO IF - ");
            //console.log(matches);

            allMatches.push(matches);
            try {
                matches.forEach((m) => {
                    fs.mkdirSync(__dirname + "/data/matches/" + m.OverviewPage, { recursive: true });
                    fs.writeFileSync(
                        __dirname + "/data/matches/" + m.OverviewPage + "/" + m.Team1 + "-" + m.Team2 + ".json",
                        JSON.stringify(m)
                    );
                });
            } catch (error) {
                console.log(error);
            }
        }
    }

    return allMatches.flat();
};

const daily = require("./utils/dailyTasks.js");
daily();

const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io", process.env.CLIENT_URL],
        credentials: true,
    },
});

const socketHandler = require("./socket/socketHandler.js");
socketHandler(io);

const { instrument } = require("@socket.io/admin-ui");
instrument(io, { auth: false });

httpServer.listen(PORT, () => console.log("Server starting on port " + PORT));
/* 2025-02-08 13:12:52.208 +00:00	2025-02-08 13:12:52.208 +00:00	1	5
2025-02-08 13:12:58.501 +00:00	2025-02-08 13:12:58.501 +00:00	1	8
2025-02-08 13:14:17.246 +00:00	2025-02-08 13:14:17.246 +00:00	1	20
2025-02-08 13:14:23.233 +00:00	2025-02-08 13:14:23.233 +00:00	1	22
2025-02-08 13:15:05.687 +00:00	2025-02-08 13:15:05.687 +00:00	1	1
2025-02-08 13:15:12.123 +00:00	2025-02-08 13:15:12.123 +00:00	1	7
2025-02-08 13:16:19.510 +00:00	2025-02-08 13:16:19.510 +00:00	1	2
2025-02-08 13:16:37.656 +00:00	2025-02-08 13:16:37.656 +00:00	1	18
2025-02-08 13:17:27.344 +00:00	2025-02-08 13:17:27.344 +00:00	1	6
2025-02-08 13:17:50.789 +00:00	2025-02-08 13:17:50.789 +00:00	1	26 */