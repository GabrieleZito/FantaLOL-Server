const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const pandascore = require("@api/developers-pandascore");
const fs = require("fs");
const db = require("../database.js");

const current = "https://api.pandascore.co/lol/tournaments/running";
const next = "https://api.pandascore.co/lol/tournaments/upcoming";

router.get("/tournaments/currentTournaments", async (req, res) => {
    pandascore.auth(process.env.PANDASCORE_API);
    pandascore
        .get_lol_tournaments_running()
        .then(({ data }) => res.json(data))
        .catch((err) => res.status(400).json(err));
});

router.get("/tournaments/nextTournaments", async (req, res) => {
    //console.log(req.user);

    pandascore.auth(process.env.PANDASCORE_API);
    pandascore
        .get_lol_tournaments_upcoming()
        .then(({ data }) => res.json(data))
        .catch((err) => res.status(400).json(err));
});

//TODO scaricare e salvare le immagini
router.get("/tournaments/lec", async (req, res) => {

    let result = {};

    let data = fs.readFileSync(__dirname + "/../liquipedia/lec_splits.json");
    data = JSON.parse(data);
    result.splits = data;

    let file = fs.readFileSync(__dirname + "/../liquipedia/lec_participants.json");
    file = JSON.parse(file);
    result.participants = file;

    const result2 = result.splits.map((x) => {
        x.participants = result.participants.filter((y) => x.pagename == y.pagename);
        return x;
    });

    res.json(result2);

    //const teams = await getLecPartecipants();
});

module.exports = router;
