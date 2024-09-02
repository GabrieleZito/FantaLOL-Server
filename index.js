const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const session = require("express-session");

//DATABASE
const sequelize = require("./config/sequelize.js");
sequelize.sync().then(async () => {
    console.log("DB connected");
});

const axios = require("axios");

const passport = require("passport");
require("./strategies/local-strategy.js");

//ROUTES
const authRouter = require("./routes/auth.js");
const leagueRouter = require("./routes/league.js");

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
    cors({
        origin: "http://localhost:5173",
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

app.listen(PORT, () => console.log("Server starting on port " + PORT));
