const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const pandascore = require("@api/developers-pandascore");
const { getLecTournaments, getLecParticipants } = require("../utils/api");
const fs = require("fs");

const current = "https://api.pandascore.co/lol/tournaments/running";
const next = "https://api.pandascore.co/lol/tournaments/upcoming";

const today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();
let currentDate = year + "-" + month + "-" + day;

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
//TODO salvare in locale json dei tournament e tutte le info
//TODO trovare come fare refetchare le info ogni tot
router.get("/tournaments/lec", async (req, res) => {
    console.log("current date:" + currentDate);

    let result = {};
    if (!fs.existsSync(__dirname + "/../liquipedia/lec_splits.json")) {
        const splits = await getLecTournaments();
        fs.writeFile(__dirname + "/../liquipedia/lec_splits.json", JSON.stringify({ date: currentDate, data: splits }), (err) => {
            if (err) console.log(err);
        });

        Object.assign(result, { splits: splits });
        //console.log("DEntro if");
    } else {
        const today = new Date();
        let data = fs.readFileSync(__dirname + "/../liquipedia/lec_splits.json");
        //console.log("dentro else");
        data = JSON.parse(data);
        const giorno = new Date(data.date);
        //console.log("giorno : " + giorno);
        //console.log("today : " + today);

        if (
            giorno.getFullYear() < today.getFullYear() ||
            giorno.getMonth() + 1 < today.getMonth() + 1 ||
            giorno.getDate() < today.getDate()
        ) {
            const splits = await getLecTournaments();
            console.log("dentro confronto");

            fs.writeFile(
                __dirname + "/../liquipedia/lec_splits.json",
                JSON.stringify({ date: currentDate, data: splits }),
                (err) => {
                    if (err) console.log(err);
                }
            );
            Object.assign(result, { splits: splits });
        } else {
            //console.log("dentro altro else");
            Object.assign(result, { splits: data.data });
        }
    }

    if (!fs.existsSync(__dirname + "/../liquipedia/lec_participants.json")) {
        const participants = await getLecParticipants();
        //console.log(participants);
        console.log("dentro 1");
        fs.writeFile(
            __dirname + "/../liquipedia/lec_participants.json",
            JSON.stringify({ date: currentDate, data: participants }),
            (err) => {
                if (err) console.log(err);
            }
        );
        Object.assign(result, { participants: participants });
    } else {
        console.log("dentro 2");
        let file = fs.readFileSync(__dirname + "/../liquipedia/lec_participants.json");
        file = JSON.parse(file);
        const giorno = new Date(file.date);
        console.log(file.date);

        if (
            giorno.getFullYear() < today.getFullYear() ||
            giorno.getMonth() + 1 < today.getMonth() + 1 ||
            giorno.getDate() < today.getDate()
        ) {
            console.log("dentro 3");

            const participants = await getLecParticipants();
            //console.log(participants);

            fs.writeFile(
                __dirname + "/../liquipedia/lec_participants.json",
                JSON.stringify({ date: currentDate, data: participants }),
                (err) => {
                    if (err) console.log(err);
                }
            );
            Object.assign(result, { participants: participants });
        } else {
            console.log("dentro 4");

            Object.assign(result, { participants: file.data });
        }
    }
    const result2 = result.splits.map((x) => {
        x.participants = result.participants.filter((y) => x.pagename == y.pagename);
        return x;
    });
    res.json(result2);

    //const teams = await getLecPartecipants();
});

module.exports = router;
