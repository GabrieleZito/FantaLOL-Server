const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const db = require("./database.js");
const fs = require("fs");

const {
    getDayMatches,
    getGamesFromMatchId,
    getTeamsFromGameId,
    getPlayerFromGameId,
    getYearTournaments,
    getTournamentsNameFromLeague,
} = require("./utils/api.js");

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
    const p = await getInfoMatches();
    res.json(p);
});

const checkPoints = async () => {
    const leads = await db.getLeaderboards();
    let c = [];
    for (let i = 0; i < leads.length; i++) {
        const e = leads[i];
        const d = await db.getLeaderboardTournaments(e.id);
        c.push(d);
    }
    return c;
};

const getInfoMatches = async () => {
    let tournaments = await db.getLeaderboardTournaments(1);
    //console.log(tournaments.Tournaments);

    tournaments = tournaments.Tournaments.map((t) => t.OverviewPage);
    //console.log(tournaments);

    let matches = [];
    for (let i = 0; i < tournaments.length; i++) {
        const t = tournaments[i];
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
    if (matches) {
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
    return matches;
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
