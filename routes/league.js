const express = require("express");
const router = express.Router();
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

module.exports = router;
