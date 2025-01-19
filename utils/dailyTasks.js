const cron = require("node-cron");
const fs = require("fs");
const { getLecTournaments, getLecParticipants, getDayMatches } = require("./api");
const db = require("../database.js");
const { default: axios } = require("axios");

module.exports = async () => {
    cron.schedule(
        "0 0 1 * * *",
        async () => {
            console.log("Daily Tasks " + new Date());

            await checkNewPlayers();
        },
        {
            timezone: "Europe/Rome",
        }
    );
};

const checkNewPlayers = async () => {
    const leads = await db.getLeaderboards();
    for (let i = 0; i < leads.length; i++) {
        const l = leads[i];
        db.addPlayersToDB(l.id);
    }
};
