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

exports.getLecPlayers = async () => {
    console.log("DEntro getLecPlayers");

    let players = [];
    if (!fs.existsSync(__dirname + "/../liquipedia/lec_splits.json")) {
        throw "Il file lec_splits.json non esiste";
    } else {
        const today = new Date();
        let file = fs.readFileSync(__dirname + "/../liquipedia/lec_splits.json");
        file = JSON.parse(file);
        //prende il torneo prossimo più vicino
        for (let i = 0; i < file.length; i++) {
            const e = file[i];
            startdate = new Date(e.startdate);
            if (startdate < today) {
                continue;
            } else {
                const tournament = e.pagename;
                let file2 = fs.readFileSync(__dirname + "/../liquipedia/lec_participants.json");
                file2 = JSON.parse(file2);

                for (let y = 0; y < file2.length; y++) {
                    const e2 = file2[y];
                    if (e2.pagename == tournament) {
                        for (var j in e2.opponentplayers) {
                            //console.log(e2.opponentplayers[j]);
                            if (
                                j.includes("p") &&
                                !j.includes("dn") &&
                                !j.includes("flag") &&
                                !j.includes("team") &&
                                !j.includes("template")
                            ) {
                                players.push(e2.opponentplayers[j]);
                                //console.log(e2.opponentplayers[j]);
                            }
                        }
                    }
                }
                break;
            }
        }
    }
    //console.log(players);
    let players2 = [];

    for (let p = 0; p < players.length; p++) {
        const e = players[p];
        //console.log(e);

        const player = await this.getPlayerByPagename(e);
        players2.push(player);
    }

    return players2;
};

exports.getPlayerByPagename = (name) => {
    return axios
        .get("https://api.liquipedia.net/api/v3/player?wiki=leagueoflegends&conditions=[[pagename::" + name + "]]", {
            headers: headers,
        })
        .then((res) => res.data.result[0]);
};

exports.getCurrentLeagues = () => {
    return axios
        .get(
            "https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=CurrentLeagues=CL&fields=CL.Event, CL.OverviewPage, CL.Priority&limit=500"
        )
        .then((res) => res.data);
};

exports.getYearTournaments = async () => {
    const date = new Date();
    const fields =
        "T.Name, T.OverviewPage, T.DateStart, T.Date, T.DateStartFuzzy, T.League, T.Region, T.Prizepool, T.Currency, T.Country, T.Rulebook, T.EventType, T.Links, T.Organizers, T.StandardName, T.BasePage," +
        " T.Split, T.SplitNumber, T.TournamentLevel, T.IsQualifier, T.IsPlayoffs, IsOfficial, T.Year, T.LeagueIconKey, T.AlternativeNames, T.Tags";

    const query =
        "https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=Tournaments=T&fields=" +
        fields +
        "&where= Year=" +
        date.getFullYear() +
        "&limit=500&order_by=Date DESC&origin=*";

    //console.log(query);

    return axios.get(query).then((res) => res.data.cargoquery);
};

exports.getDayMatches = async (t) => {
    const date = new Date();
    const yesterday = "2024-01-15"; //date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +(date.getDate() - 1);
    const today = "2024-01-16"; // date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    //console.log(yesterday);

    const query =
        "https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=MatchSchedule=MS&fields=MS.Team1,MS.Team2,MS.OverviewPage, MS.DateTime_UTC,MS.Team1Final, MS.Team2Final," +
        " MS.Winner, MS.Team1Points, MS.Team2Points, MS.BestOf, MS.Phase, MS.Patch, MS.MVP, MS.MatchId, MS.Team1PointsTB, MS.Team2PointsTB, MS.Team1Score, MS.Team2Score, MS.Team1Poster, MS.Team2Poster," +
        " MS.Team1Advantage, MS.Team2Advantage,MS.FF, MS.Player1, MS.Player2, MS.Tags,MS.MatchDay, MS.ShownName, MS.ShownRound,MS.QQ, MS.PageAndTeam1,MS.Team1Footnote,MS.UniqueMatch, MS.MatchId" +
        "&join_on&limit=500&where=OverviewPage = '" +
        t +
        "'  AND DateTime_UTC>'" +
        yesterday +
        "' AND DateTime_UTC<'" +
        today +
        "'&order_by=DateTime_UTC ASC&origin=*";

    return axios.get(query).then((res) => res.data.cargoquery);
};

exports.getGamesFromMatchId = async (id) => {
    const query =
        "https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=MatchScheduleGame=MSG&fields=MSG.Blue, MSG.Red, MSG.Winner, MSG.BlueScore, MSG.RedScore, MSG.BlueFinal," +
        " MSG.RedFinal, MSG.BlueFootnote, MSG.RedFootnote, MSG.Footnote, MSG.FF, MSG.Selection, MSG.MatchHistory, MSG.Recap, MSG.Vod, MSG.MVP, MSG.MVPPoints, MSG.OverviewPage, MSG.GameId, MSG.MatchId," +
        " MSG.WrittenSummary&where=MatchId='" +
        id +
        "'&join_on&limit=500&origin=*";
    return axios.get(query).then((res) => res.data.cargoquery);
};

exports.getTeamsFromGameId = async (id) => {
    //console.log(id);

    const query =
        "https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=ScoreboardTeams=SBT&fields=SBT.Team, SBT.Side, SBT.Number, SBT.IsWinner, SBT.Score, SBT.Bans, SBT.Picks, SBT.Roster," +
        " SBT.Dragons, SBT.Barons, SBT.Towers, SBT.Gold, SBT.Kills, SBT.RiftHeralds, SBT.VoidGrubs, SBT.Inhibitors, SBT.OverviewPage, SBT.StatsPage, SBT.UniqueGame, SBT.UniqueTeam, SBT.GameId, SBT.MatchId," +
        " SBT.GameTeamId&limit=500&where=GameId= '" +
        id +
        "'&origin=*";
    return axios.get(query).then((res) => res.data.cargoquery);
};

exports.getPlayerFromGameId = async (id) => {
    const query =
        "https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=ScoreboardPlayers=SP&fields=SP.OverviewPage, SP.Name, SP.Link, SP.Champion, SP.Kills, SP.Deaths, SP.Assists," +
        " SP.SummonerSpells, SP.Gold, SP.CS, SP.DamageToChampions, SP.VisionScore, SP.Items, SP.Trinket, SP.KeystoneMastery, SP.KeystoneRune, SP.PrimaryTree, SP.SecondaryTree, SP.Runes, SP.TeamKills, SP.TeamGold," +
        " SP.Team, SP.TeamVs, SP.Time, SP.PlayerWin, SP.DateTime_UTC, SP.DST, SP.Tournament, SP.Role, SP.Role_Number, SP.IngameRole, SP.Side, SP.UniqueLine, SP.UniqueRole, SP.GameId, SP.MatchId, SP.StatsPage" +
        "&limit=500&where=GameId= '" +
        id +
        "'&origin=*";

    return axios.get(query).then((res) => res.data.cargoquery);
};

exports.getCurrentLeaguesFromTournaments = async () => {
    const date = new Date();
    const query =
        "https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=Tournaments=T&fields=T.Name, T.OverviewPage, T.DateStart, T.Date, T.DateStartFuzzy, T.League, T.StandardName," +
        " T.Year, T.LeagueIconKey, T.AlternativeNames&limit=500&where=Year=" +
        date.getFullYear() +
        "&order_by=Date DESC&origin=*";
    return axios.get(query).then((res) => res.data.cargoquery);
};

exports.getTournamentsNameFromLeague = async (league) => {
    const date = new Date();
    const query =
        "https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=Tournaments=T&fields=T.Name, T.OverviewPage, T.DateStart, T.Date, T.League, T.LeagueIconKey&limit=500" +
        "&where=Year=" +
        date.getFullYear() +
        " AND League = '" +
        league +
        "'&origin=*";
    console.log(query);

    return axios.get(query).then((res) => res.data.cargoquery);
};
