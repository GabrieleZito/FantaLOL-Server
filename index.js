const express = require("express");
const morgan = require("morgan");

const app = express();

const PORT = 3000;

app.use(morgan("dev"));

app.get("/get", (req, res) =>{
    res.json("CIAO")
})

app.listen(PORT, () => console.log("Server starting on port " + PORT));
