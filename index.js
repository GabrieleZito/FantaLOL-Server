const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const session = require("express-session");

const app = express();

//DB
const { sequelize } = require("./config/dbConnect.js");
const { User } = require("./models/user.js");
//sequelize.sync().then(()=>console.log("fatto")).catch(()=> console.log("NON FATTO"));

const PORT = 3000;

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

app.get("/get", (req, res) => {
    res.json({ msg: "CIAO" });
});

app.post("/post", async (req, res) => {
    const jane = await User.create({ firstName: "Jane", lastName: "peppina" });
    console.log(jane.toJSON());

    res.json(jane.toJSON());
});

app.listen(PORT, () => console.log("Server starting on port " + PORT));
