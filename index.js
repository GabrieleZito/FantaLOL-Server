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
const TeamPoints = require("./models/teampoints.js");
const Partecipations = require("./models/partecipations.js");
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
