const cron = require("node-cron");
const fs = require("fs");
const { getLecPlayers, getLecTournaments, getLecParticipants, getDayMatches } = require("./api");
const db = require("../database.js");
const { default: axios } = require("axios");

module.exports = async () => {
    cron.schedule(
        "0 0 1 * * *",
        async () => {
            console.log("Daily Tasks " + new Date());

            await LecSplits();
            await LecParticipants();
            await LecPlayers();
            await addPlayersToDB();
        },
        {
            timezone: "Europe/Rome",
        }
    );
};

const LecSplits = async () => {
    const splits = await getLecTournaments();
    try {
        fs.writeFileSync(__dirname + "/../liquipedia/lec_splits.json", JSON.stringify(splits));
    } catch (error) {
        console.error("Error writing file:", error);
    }
};

const LecParticipants = async () => {
    const participants = await getLecParticipants();
    try {
        fs.writeFileSync(__dirname + "/../liquipedia/lec_participants.json", JSON.stringify(participants));
    } catch (error) {
        console.error("Error writing file:", error);
    }
};

const LecPlayers = async () => {
    const players = await getLecPlayers();
    //console.log(players);

    try {
        fs.writeFileSync(__dirname + "/../liquipedia/lec_players.json", JSON.stringify(players));
    } catch (error) {
        console.error("Error writing file:", error);
    }
};

const addPlayersToDB = async () => {
    try {
        let players = fs.readFileSync(__dirname + "/../liquipedia/lec_players.json");
        players = JSON.parse(players);
        //console.log(players);
        //console.log("dentro add");

        for (let p = 0; p < players.length; p++) {
            const e = players[p];
            const c = await db.getPlayerByName(e.pagename);
            if (!c) {
                await db.createPlayer(e.pagename, e.extradata.role);
            }
        }
        //console.log(c);
    } catch (error) {
        console.error(error);
    }
};
