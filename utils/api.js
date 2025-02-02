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

exports.getPlayerByPagename = (name) => {
    return axios
        .get("https://api.liquipedia.net/api/v3/player?wiki=leagueoflegends&conditions=[[pagename::" + name + "]]", {
            headers: headers,
        })
        .then((res) => res.data.result[0]);
};

exports.getPlayerById = (id) => {
    return axios
        .get("https://api.liquipedia.net/api/v3/player?wiki=leagueoflegends&conditions=[[id::" + id + "]]", {
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
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday = yesterday.getFullYear() + "-" + (yesterday.getMonth() + 1) + "-" + yesterday.getDate();
    const today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    console.log(yesterday);

    const query =
        "https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=MatchSchedule=MS&fields=MS.Team1,MS.Team2,MS.OverviewPage, MS.DateTime_UTC,MS.Team1Final, MS.Team2Final," +
        " MS.Winner, MS.Team1Points, MS.Team2Points, MS.BestOf, MS.Phase, MS.Patch, MS.MVP, MS.MatchId, MS.Team1PointsTB, MS.Team2PointsTB, MS.Team1Score, MS.Team2Score, MS.Team1Poster, MS.Team2Poster," +
        " MS.Team1Advantage, MS.Team2Advantage,MS.FF, MS.Player1, MS.Player2, MS.Tags,MS.MatchDay, MS.ShownName, MS.ShownRound,MS.QQ, MS.PageAndTeam1,MS.Team1Footnote,MS.UniqueMatch, MS.MatchId" +
        "&join_on&limit=500&where=OverviewPage = '" +
        t +
        "'  AND DateTime_UTC>'" +
        yesterday +
        //"2025-02-01" +
        "' AND DateTime_UTC<'" +
        today +
        //"2025-02-02" +
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

exports.getStandingsFromOverviewPage = async (op) => {
    const query =
        "https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=Standings=S&fields=S.OverviewPage, S.Team, S.PageAndTeam, S.N, S.Place, S.WinSeries, S.LossSeries, S.TieSeries, " +
        "S.WinGames, S.LossGames,S.Points, S.PointsTiebreaker, S.Streak, S.StreakDirection&limit=500&where=OverviewPage= '" +
        op +
        "'&origin=*";
    return axios.get(query).then((res) => res.data.cargoquery);
};

exports.getPlayersOfTeam = async (team) => {
    const query =
        "https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=Players=PL&fields=PL.ID, PL.OverviewPage, PL.Player, PL.Image, PL.Name, PL.NativeName, PL.NameFull, PL.Country," +
        " PL.Nationality, PL.Age, PL.Birthdate, PL.Team, PL.Team2, PL.Role, PL.IsRetired&limit=500&where=Team= '" +
        team +
        "'&origin=* ";
    return axios.get(query).then((res) => res.data.cargoquery);
};
