const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const db = require("./database.js");

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
app.use(
    cors({
        origin: ["https://admin.socket.io", "http://localhost:5173"],
        credentials: true,
    })
);

app.use(
    session({
        secret: "fj35hdsfh544kjdska",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/league", leagueRouter);
app.use("/users", usersRouter);
app.use("/leaderboards", leadRouter);

app.get("/prova", async (req, res) => {
    const c = await db.getCurrentAuction(1)
    res.json(c)
})

const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io", "http://localhost:5173"],
        credentials: true,
    },
});

const socketHandler = require("./socket/socketHandler.js");
socketHandler(io);

const { instrument } = require("@socket.io/admin-ui");
instrument(io, { auth: false });

httpServer.listen(PORT, () => console.log("Server starting on port " + PORT));
