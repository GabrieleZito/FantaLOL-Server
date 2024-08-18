const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const session = require("express-session");

//DB
require("./config/dbConnect.js");


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



app.use("/auth", authRouter);

app.listen(PORT, () => console.log("Server starting on port " + PORT));
