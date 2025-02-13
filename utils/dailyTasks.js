const cron = require("node-cron");
const db = require("../database.js");

module.exports = async () => {
    cron.schedule(
        //"0,30 * * * * *",
        "0 0 1 * * *",
        async () => {
            console.log("Daily Tasks " + new Date());

            await checkNewPlayers();
            await checkPoints();
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
    const matches = await getInfoMatches();
    let points = [];
    if (matches && matches.length > 0) {
        for (let i = 0; i < matches.length; i++) {
            const m = matches[i];
            if (m.MVP) {
                const mvp = await db.setPoints("MVP", m.MVP);
                points.push(mvp);
            }
            for (let j = 0; j < m.Games.length; j++) {
                const g = m.Games[j];
                if (g.MVP) {
                    const mvp = await db.setPoints("MVP", g.MVP);
                    points.push(mvp);
                }
                for (let k = 0; k < g.Teams.length; k++) {
                    const t = g.Teams[k];
                    //TODO spazio per eventualmente punti della squadra
                    for (let x = 0; x < t.Players.length; x++) {
                        const p = t.Players[x];
                        //console.log(p.UniqueLine);
                        if (parseInt(p.Kills) > 0) {
                            //console.log(p.Name + " " + p.Kills + " kills");

                            const kills = await db.setPoints("Kills", p.Name, parseInt(p.Kills));
                            points.push(kills);
                        }
                        if (parseInt(p.Gold) > 10000) {
                            //console.log(p.Name + " " + p.Gold + " gold");

                            const gold = await db.setPoints("Gold", p.Name, parseInt(p.Gold));
                            points.push(gold);
                        }
                        if (parseInt(p.CS) > 200) {
                            //console.log(p.Name + " " + p.CS + " cs");

                            const cs = await db.setPoints("CS", p.Name, parseInt(p.CS));
                            points.push(cs);
                        }
                        if (parseInt(p.DamageToChampions) > 10000) {
                            //console.log(p.Name + " " + p.DamageToChampions + " DamageToChampions");

                            const damage = await db.setPoints("Damage", p.Name, parseInt(p.DamageToChampions));
                            points.push(damage);
                        }
                        if (parseInt(p.VisionScore) > 90) {
                            //console.log(p.Name + " " + p.VisionScore + " VisionScore");

                            const vision = await db.setPoints("Vision", p.Name, parseInt(p.VisionScore));
                            points.push(vision);
                        }
                    }
                }
            }
        }
    }
    const teams = await db.getAllTeams();
    //itera fra tutti i punti appena creati
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        //itera fra tutti i team appartenenti ad una leaderboard
        for (let j = 0; j < teams.length; j++) {
            const t = teams[j];
            const part = await db.getPartecipationByTeam(t.id);
            //itera fra tutti i player appartenenti al team
            for (let x = 0; x < t.Players.length; x++) {
                const pl = t.Players[x];
                //verifica che il player sia attivo
                if (p.PlayerId == pl.id) {
                    //console.log("associando " + p.id + " e " + t.id);
                    const tp = await db.createTeamPoints(p.id, t.id);
                    await part.increment("score", { by: p.points });
                }
            }
        }
    }
    return matches;
};

const getInfoMatches = async () => {
    const leads = await db.getLeaderboards();
    let allMatches = [];
    for (let i = 0; i < leads.length; i++) {
        const e = leads[i];

        let tournaments = await db.getLeaderboardTournaments(e.id);
        //console.log(tournaments.Tournaments);

        tournaments = tournaments.Tournaments.map((t) => t.OverviewPage);
        //console.log(tournaments);

        let matches = [];
        for (let i = 0; i < tournaments.length; i++) {
            const t = tournaments[i];
            //console.log(t)
            let res = await getDayMatches(t);
            if (res.length > 0) {
                res = res.map((t) => t.title);
                matches.push(res);
            }
        }
        matches = matches.flat();
        matches = await Promise.all(
            matches.map(async (m) => {
                let games = await getGamesFromMatchId(m.MatchId);
                games = games.map((g) => g.title);
                games = await Promise.all(
                    games.map(async (g) => {
                        let teams = await getTeamsFromGameId(g.GameId);
                        teams = teams.map((t) => t.title);
                        g.Teams = teams;
                        teams = await Promise.all(
                            teams.map(async (t) => {
                                let players = await getPlayerFromGameId(t.GameId);
                                players = players.map((p) => p.title);
                                t.Players = players.filter((p) => p.Team == t.Team);
                                return t;
                            })
                        );
                        return g;
                    })
                );
                m.Games = games;
                return m;
            })
        );
        //console.log(matches);
        if (matches.length > 0) {
            //console.log("DENTRO IF - ");
            //console.log(matches);

            allMatches.push(matches);
            try {
                matches.forEach((m) => {
                    fs.mkdirSync(__dirname + "/data/matches/" + m.OverviewPage, { recursive: true });
                    fs.writeFileSync(
                        __dirname + "/data/matches/" + m.OverviewPage + "/" + m.Team1 + "-" + m.Team2 + ".json",
                        JSON.stringify(m)
                    );
                });
            } catch (error) {
                console.log(error);
            }
        }
    }

    return allMatches.flat();
};
