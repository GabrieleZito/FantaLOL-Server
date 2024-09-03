const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const pandascore = require("@api/developers-pandascore");

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

router.get("/tournaments/:id", (req, res) => {
    const { id } = req.params;
    console.log(req.params);

    pandascore.auth(process.env.PANDASCORE_API);
    pandascore
        .get_lol_tournaments({})
        .then(({ data }) => {
            const tour = data.filter( t => t.id == id)
            res.json(tour[0]);
            //console.log(data);
        })
        .catch((err) => res.status(400).json(err));
});

module.exports = router;
