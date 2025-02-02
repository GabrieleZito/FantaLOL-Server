const cron = require("node-cron");
const db = require("../database.js");

module.exports = async () => {
    cron.schedule(
        //"0,30 * * * * *",
        "0 0 1 * * *",
        async () => {
            console.log("Daily Tasks " + new Date());

            await checkNewPlayers();
            await checkPoints()
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

const checkPoints = async () => {
    
}