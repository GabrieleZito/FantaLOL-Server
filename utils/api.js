const { default: axios } = require("axios");

const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = year + "-" + month + "-" + day;

const headers = {
    Authorization: "Apikey " + process.env.LIQUIPEDIA_API,
    "User-Agent": "FantaLOL",
};

exports.getLecTournaments = () => {
    return axios
        .get(
            "https://api.liquipedia.net/api/v3/tournament?wiki=leagueoflegends&query&order=startdate DESC&conditions=[[startdate::>" +
                currentDate +
                "]] AND [[seriespage::LEC]]&limit=50",
            {
                headers: headers,
            }
        )
        .then((ret) => {
            //console.log(ret.data.result);

            return ret.data.result;
        });
};

exports.getLecParticipants = () => {
    return axios
        .get(
            "https://api.liquipedia.net/api/v3/placement?wiki=leagueoflegends&query&order=date DESC&conditions=[[series::LEC]] AND [[startdate::>" +
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
