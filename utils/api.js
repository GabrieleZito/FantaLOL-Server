const { default: axios } = require("axios");
const fs = require("fs");

const headers = {
    Authorization: "Apikey " + process.env.LIQUIPEDIA_API,
    "User-Agent": "FantaLOL",
};

exports.getLecTournaments = () => {
    const date = new Date();
    let currentDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return axios
        .get(
            "https://api.liquipedia.net/api/v3/tournament?wiki=leagueoflegends&query&order=startdate ASC&conditions=[[startdate::>" +
                currentDate +
                "]] AND [[seriespage::LEC]]&limit=50",
            {
                headers: headers,
            }
        )
        .then((ret) => {
            return ret.data.result;
        });
};

exports.getLecParticipants = () => {
    const date = new Date();
    let currentDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return axios
        .get(
            "https://api.liquipedia.net/api/v3/placement?wiki=leagueoflegends&query&order=date ASC&conditions=[[series::LEC]] AND [[startdate::>" +
                currentDate +
                "]]&limit=1000",
            { headers: headers }
        )
        .then((res) => {
            const part = res.data.result;
            const filt = part.filter((p) => {
                //console.log(p.objectname);
                //console.log(!p.objectname.includes("tbd"));
                return !p.objectname.includes("tbd");
            });
            return filt;
        });
};

exports.getLecPlayers = () => {
    let players = [];
    if (!fs.existsSync(__dirname + "/../liquipedia/lec_splits.json")) {
        throw "Il file lec_splits.json non esiste";
    } else {
        const today = new Date();
        let file = fs.readFileSync(__dirname + "/../liquipedia/lec_splits.json");
        file = JSON.parse(file);
        //prende il torneo prossimo più vicino
        for (let i = 0; i < file.data.length; i++) {
            const e = file.data[i];
            startdate = new Date(e.startdate);
            if (startdate < today) {
                continue;
            } else {
                const tournament = e.pagename;
                let file2 = fs.readFileSync(__dirname + "/../liquipedia/lec_participants.json");
                file2 = JSON.parse(file2);

                for (let y = 0; y < file2.data.length; y++) {
                    const e2 = file2.data[y];
                    if (e2.pagename == tournament) {
                        for (var j in e2.opponentplayers) {
                            if (j.includes("p") && j.includes("dn")) {
                                players.push(e2.opponentplayers[j]);
                            }
                        }
                    }
                }
                break;
            }
        }
    }
    //console.log(players);

    return players;
};

exports.getPlayerByName = (name) => {
    return axios
        .get("https://api.liquipedia.net/api/v3/player?wiki=leagueoflegends&conditions=[[id::" + name + "]]", {
            headers: headers,
        })
        .then((res) => res.data.result[0]);
};
