const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const session = require("express-session");

//DATABASE
const sequelize = require("./config/sequelize.js");
const { UserProfile, UserAuth } = require("./models/");

sequelize.sync().then(async () => {
    console.log("DB connected");
    /*  const userInfo = await UserAuth.findAll({
        where: { id: 2 },
        include: [{ model: UserProfile }],
    });
    console.log(userInfo); */
});

const passport = require("passport");
require("./strategies/local-strategy.js");

const authRouter = require("./routes/auth.js");

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

app.get("/test", async (req, res) => {
    //console.log(await verify("$argon2id$v=19$m=65536,t=3,p=4$IckiaHpOxaFR/03neVVFxA$dQAv1YoL52ejkqs75NYCHtzHLKi5GSuFVqIVT5yWLiE", 1231231a23))
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);

app.listen(PORT, () => console.log("Server starting on port " + PORT));
