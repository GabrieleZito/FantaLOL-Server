const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const pandascore = require("@api/developers-pandascore");
const fs = require("fs");
const db = require("../database.js");
const { getYearTournaments, getCurrentLeaguesFromTournaments } = require("../utils/api.js");

router.get("/tournaments/currentTournaments", async (req, res) => {
    let tournaments = await getYearTournaments();
    tournaments = tournaments.map((t) => t.title);
    tournaments = tournaments.reduce((groups, tournament) => {
        const key = tournament.Region;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(tournament);
        return groups;
    }, {});
    res.json(tournaments);
});

router.get("/currentLeagues", async (req, res) => {
    let tournaments = await getCurrentLeaguesFromTournaments();
    tournaments = tournaments.map((t) => t.title);
    const leagues = new Set();
    tournaments.forEach((t) => {
        if (t.League) {
            leagues.add(t.League);
        }
    });
    //console.log(leagues);

    res.json(Array.from(leagues));
});

router.get("/tournaments/nextTournaments", async (req, res) => {
    //console.log(req.user);

    pandascore.auth(process.env.PANDASCORE_API);
    pandascore
        .get_lol_tournaments_upcoming()
        .then(({ data }) => res.json(data))
        .catch((err) => res.status(400).json(err));
});


module.exports = router;
