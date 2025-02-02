const {
    UserProfile,
    Friendships,
    Leaderboards,
    Partecipations,
    Invites,
    Teams,
    Auctions,
    Bids,
    Players,
    TeamPlayers,
    Tournaments,
    LeaderboardTournaments,
    LeaderboardPlayers,
} = require("./models/");
const { verifyPassword } = require("./utils/misc");
const sequelize = require("./config/sequelize");
const { Op, QueryTypes } = require("sequelize");
const fs = require("fs");
const {
    getTournamentsNameFromLeague,
    getStandingsFromOverviewPage,
    getPlayersOfTeam,
    getPlayerById,
    getDayMatches,
    getGamesFromMatchId,
    getTeamsFromGameId,
    getPlayerFromGameId,
} = require("./utils/api");

exports.checkUser = (username, password) => {
    return new Promise(async (resolve, reject) => {
        const user = await UserProfile.findOne({ where: { username: username } });
        if (user) {
            if (await verifyPassword(password, user.passwordHash)) {
                //console.log("PAssword uguali");
                const user2 = await this.getUserById(user.id);
                //console.log("USER2");

                //console.log(user2);
                resolve(user2);
            } else {
                const err = "Wrong Username or password";
                //console.log(err);

                reject({ err });
            }
        } else {
            //console.log("Nessun utente");
            reject({ err: "Nessun Utente" });
        }
    });
};

exports.getUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        const userInfo = await UserProfile.findAll({
            where: { id: id },
        });
        if (userInfo) {
            //console.log("USERINFO");
            //console.log(userInfo[0].dataValues.UserProfile);
            const user = {
                id: userInfo[0].dataValues.id,
                email: userInfo[0].dataValues.email,
                username: userInfo[0].dataValues.username,
                firstName: userInfo[0].dataValues.firstName,
                lastName: userInfo[0].dataValues.lastName,
                birthDay: userInfo[0].dataValues.birthDay,
                bio: userInfo[0].dataValues.bio,
                profilePicture: userInfo[0].dataValues.profilePicture,
            };
            //console.log(user);

            resolve(user);
        }
        reject({ err: "Error retrieving userData" });
    });
};

exports.getFriendRequests = async (id) => {
    try {
        const users = await sequelize.query(
            "Select UserProfiles.id, UserProfiles.username, UserProfiles.profilePicture FROM UserProfiles, Friendships where Friendships.UserProfileId = UserProfiles.id and Friendships.FriendId = ? and Friendships.UserProfileId = UserProfiles.id and status = 'pending'",
            {
                type: QueryTypes.SELECT,
                logging: console.log,
                replacements: [id],
            }
        );
        return users;
    } catch (e) {
        throw e;
    }
};

exports.acceptFriendRequest = async (id1, id2) => {
    try {
        const row = await Friendships.findOne({
            where: {
                FriendId: id1,
                UserProfileId: id2,
            },
        });
        if (row != null) {
            //console.log(row);
            row.status = "accepted";
            await row.save();
            return { msg: "Friend request Accepted" };
        } else {
            //console.log("ERRORE");
            throw Error("There was a problem with the request");
        }
    } catch (e) {
        throw e;
    }
};

exports.getFriends = async (id) => {
    try {
        const friendships = await Friendships.findAll({
            where: {
                [Op.or]: [{ UserProfileId: id }, { FriendId: id }],
                status: "accepted",
            },
        });
        //console.log(friendships)
        if (friendships != null && friendships.length > 0) {
            const friends = Promise.all(
                friendships.map(async (f) => {
                    const friendId = id == f.UserProfileId ? f.FriendId : f.UserProfileId;
                    const friend = await UserProfile.findOne({
                        where: {
                            id: friendId,
                        },
                        attributes: ["bio", "birthday", "email", "firstName", "id", "lastName", "profilePicture", "username"],
                    });
                    //console.log(friend);

                    return friend;
                })
            );
            //console.log(friends);
            return friends;
        }
    } catch (error) {
        throw error;
    }
};

exports.createLeaderboard = async (data) => {
    try {
        const leaderboard = await Leaderboards.create({
            name: data.name,
            private: data.private,
            fee: data.fee,
            max_coins: data.coins,
            createdBy: data.idUser,
        });
        let tournaments = await getTournamentsNameFromLeague(data.league);
        tournaments = tournaments.map((t) => t.title);
        for (let i = 0; i < tournaments.length; i++) {
            const t = tournaments[i];

            let tour = await Tournaments.findOne({
                where: {
                    OverviewPage: t.OverviewPage,
                },
            });
            if (!tour) {
                tour = await Tournaments.create({
                    name: t.Name,
                    OverviewPage: t.OverviewPage,
                });
            }
            const LT = LeaderboardTournaments.create({
                TournamentId: tour.id,
                LeaderboardId: leaderboard.id,
            });
        }
        const team = await Teams.create({});
        const part = await Partecipations.create({
            coins: leaderboard.max_coins,
            score: 0,
            UserProfileId: data.idUser,
            LeaderboardId: leaderboard.id,
            TeamId: team.id,
        });

        this.addPlayersToDB(leaderboard.id);

        return { leaderboard, part };
    } catch (error) {
        //console.log(error);

        throw error;
    }
};

exports.getLeaderboard = async (id) => {
    try {
        const lead = await Leaderboards.findOne({
            where: {
                id: id,
            },
            include: {
                model: UserProfile,
                as: "Partecipate",
            },
        });
        //console.log(lead);
        return lead;
    } catch (error) {
        throw error;
    }
};

exports.getInfoLeaderboardForUser = async (leadId, userId) => {
    try {
        const lead = await Leaderboards.findOne({
            where: {
                id: leadId,
            },
            include: {
                model: UserProfile,
                as: "Partecipate",
                where: {
                    id: userId,
                },
            },
        });
        //console.log(lead);
        return lead;
    } catch (error) {
        throw error;
    }
};

exports.getUserLeaderboards = async (userId) => {
    try {
        const data = await Leaderboards.findAll({
            where: {
                createdBy: userId,
            },
        });
        //console.log(data);

        return data;
    } catch (error) {
        throw error;
    }
};

exports.sendInvite = async (data) => {
    try {
        console.error("UserProfileId: " + data.id);
        console.error("InviteId: " + data.body.friend.id);
        console.error("LeaderboardId: " + data.body.idLeaderboard);
        const invite = await Invites.create({
            UserProfileId: data.id,
            InvitedUserId: data.body.friend.id,
            status: "pending",
            LeaderboardId: data.body.idLeaderboard,
        });
        return invite;
    } catch (error) {
        throw error;
    }
};

exports.getNotifications = async (userId) => {
    try {
        const pending1 = await Friendships.findAll({
            where: {
                status: "pending",
                FriendId: userId,
            },
        });
        const pending2 = await Invites.findAll({
            where: {
                status: "pending",
                InvitedUserId: userId,
            },
        });
        return pending1.length + pending2.length;
    } catch (err) {
        throw err;
    }
};

exports.getInvites = async (userId) => {
    try {
        //console.log(userId);

        const invites = await Invites.findAll({
            where: {
                InvitedUserId: userId,
                status: "pending",
            },
            attributes: ["id", "status", "LeaderboardId", "UserProfileId"],
            include: {
                model: Leaderboards,
                attributes: ["id", "name", "fee", "createdBy"],
                include: {
                    model: UserProfile,
                    as: "Created",
                    attributes: ["username"],
                },
            },
        });
        //console.log(invites);

        return invites;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

exports.acceptInvite = async (id) => {
    try {
        const invite = await Invites.findByPk(id);
        //console.log(invite);
        const lead = await Leaderboards.findByPk(invite.LeaderboardId);
        const team = await Teams.create({});
        const part = await Partecipations.create({
            coins: lead.max_coins,
            UserProfileId: invite.InvitedUserId,
            LeaderboardId: invite.LeaderboardId,
            TeamId: team.id,
        });
        const inv = await invite.update({ status: "accepted" });
        return invite;
    } catch (error) {
        throw error;
    }
};

exports.getFriendLeaderboards = async (id) => {
    try {
        //const user = await UserProfile.findByPk(id);
        const leads = await UserProfile.findAll({
            where: {
                id: id,
            },
            attributes: { exclude: ["passwordHash", "createdAt", "updatedAt"] },
            include: {
                model: Leaderboards,
                as: "Partecipate",
                where: {
                    createdBy: {
                        [Op.ne]: id,
                    },
                },
            },
        });
        if (leads.length > 0) {
            return leads[0].Partecipate;
        } else {
            return [];
        }
    } catch (error) {
        throw error;
    }
};

exports.getCurrentAuction = async (leadId) => {
    try {
        const auction = await Auctions.findOne({
            where: {
                LeaderboardId: leadId,
                status: "active",
            },
            include: {
                model: Players,
            },
        });
        //console.log(auction);
        if (auction) {
            const bids = await Bids.findAll({
                where: {
                    AuctionId: auction.id,
                },
                include: {
                    model: UserProfile,
                    attributes: ["username"],
                },
            });
            const result = auction.dataValues;
            result.bids = bids.map((b) => b.dataValues);
            //console.log(result);
            result.Player = await getPlayerById(result.Player.name);
            return result;
        } else return null;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.newAuction = async (startTime, endTime, playerId, leadId) => {
    try {
        const auction = await Auctions.create({
            status: "active",
            startTime: startTime,
            endTime: endTime,
            PlayerId: playerId,
            LeaderboardId: leadId,
        });
        return auction;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.newPlayer = async (player) => {
    try {
        const p = await Players.create({
            name: player.id,
            role: player.extradata.role,
        });
        return p;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.getUserCoins = async (userId, leadId) => {
    try {
        const lead = await Leaderboards.findOne({
            where: {
                id: leadId,
            },
            include: {
                model: UserProfile,
                as: "Partecipate",
                where: {
                    id: userId,
                },
            },
        });
        //console.log(lead);
        return lead;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.newBid = async (bid, userId, auctionId) => {
    try {
        const Bid = await Bids.create({
            bid: bid,
            UserProfileId: userId,
            AuctionId: auctionId,
        });
        return Bid.dataValues;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.getBidsForAuction = async (auctionId) => {
    try {
        const bids = await Bids.findAll({
            where: {
                AuctionId: auctionId,
            },
            include: {
                model: UserProfile,
                attributes: ["username"],
            },
        });
        return bids;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.updateAuction = async (auctionId, bid, userId) => {
    try {
        const auction = await Auctions.findOne({
            where: {
                id: auctionId,
            },
        });
        await auction.update({ currentBid: bid, UserProfileId: userId });
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.endAuction = async (auctionId) => {
    try {
        const maxBid = await Bids.max("bid", { where: { auctionId: auctionId } });
        const auction = await Auctions.findByPk(auctionId);
        if (!auction.currentBid || !auction.UserProfileId) {
            await auction.update({ status: "cancelled", endTime: Date.now() });
            return null;
        } else {
            await auction.update({ status: "closed", currentBid: maxBid, endTime: Date.now() });
            const au = await Auctions.findOne({
                where: (id = auctionId),
                include: {
                    model: Players,
                },
            });
            const leadId = au.LeaderboardId;
            const userId = au.UserProfileId;
            const partec = await Partecipations.findOne({
                where: {
                    UserProfileId: userId,
                    LeaderboardId: leadId,
                },
            });
            //console.log(partec);
            await partec.update({ coins: partec.coins - auction.currentBid });
            const teamId = partec.TeamId;
            const teamPlayer = await TeamPlayers.create({
                TeamId: teamId,
                PlayerId: au.Player.id,
            });
            //console.log(au);

            return auction;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.getMaxBid = async (auctionId) => {
    try {
        const maxBid = await Bids.max("bid", { where: { auctionId: auctionId } });
        return maxBid;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.createPlayer = async (name, role) => {
    try {
        const player = await Players.create({
            name: name,
            role: role,
        });
        return player;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.getClosedAuctions = async (leadId) => {
    try {
        const auctions = await Auctions.findAll({
            where: {
                LeaderboardId: leadId,
                status: { [Op.or]: ["closed", "cancelled"] },
            },
            include: Players,
        });
        return auctions;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.getPlayers = async () => {
    try {
        const players = await Players.findAll();
        return players;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.getPlayersForLeaderboard = async (leadId) => {
    try {
        const players = await Players.findAll({
            include: {
                model: Leaderboards,
                where: {
                    id: leadId,
                },
            },
        });
        return players;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.getPlayerByName = async (name) => {
    try {
        const player = await Players.findOne({
            where: {
                name: name,
            },
        });
        return player;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.getPlayerById = async (playerId) => {
    try {
        const player = await Players.findByPk(playerId);
        return player;
    } catch (error) {
        console.error(error);
    }
};

exports.getUserTeam = async (userId, leadId) => {
    try {
        const part = await Partecipations.findOne({
            where: {
                UserProfileId: userId,
                LeaderboardId: leadId,
            },
            attributes: ["TeamId"],
            include: {
                model: Teams,
                attributes: ["id", "name"],
                include: {
                    model: Players,
                },
            },
        });
        console.log(part);

        return part;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.getLeaderboardTournaments = async (leadId) => {
    try {
        const tours = await Leaderboards.findOne({
            where: {
                id: leadId,
            },
            include: {
                model: Tournaments,
            },
        });
        return tours;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

exports.addPlayersToDB = async (leadId) => {
    try {
        let tournaments = await this.getLeaderboardTournaments(leadId);
        tournaments = tournaments.Tournaments.map((t) => t.OverviewPage);
        let teams = new Set();
        for (let i = 0; i < tournaments.length; i++) {
            const t = tournaments[i];

            let standings = await getStandingsFromOverviewPage(t);
            //console.log(standings);
            standings.forEach((s) => {
                //console.log("Standings");
                //console.log(s.title);
                if (s.title.Team != "TBD") {
                    teams.add(s.title.Team);
                }
            });
        }
        let players = [];
        for (const t of teams) {
            //const t = teams[i];
            let p = await getPlayersOfTeam(t);
            //console.log(p);
            p.forEach((p) => {
                if (
                    p.title.Role == "Support" ||
                    p.title.Role == "Bot" ||
                    p.title.Role == "Mid" ||
                    p.title.Role == "Jungle" ||
                    p.title.Role == "Top"
                ) {
                    players.push({ name: p.title.ID, role: p.title.Role, longName: p.title.OverviewPage.replaceAll(" ", "_") });
                }
            });
        }

        for (let i = 0; i < players.length; i++) {
            const p = players[i];
            let player = await Players.findOne({
                where: {
                    name: p.name,
                },
            });
            if (!player) {
                player = await Players.create({
                    name: p.name,
                    role: p.role,
                    longName: p.longName,
                });
            }
            /* console.log("PLAYER");
            console.log(player); */
            const LP = await LeaderboardPlayers.findOne({
                where: {
                    LeaderboardId: leadId,
                    PlayerId: player.id,
                },
            });
            if (!LP) {
                const LP = await LeaderboardPlayers.create({
                    LeaderboardId: leadId,
                    PlayerId: player.id,
                });
            }
        }

        //console.log(players);
        return players;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.getLeaderboards = async () => {
    try {
        const leads = await Leaderboards.findAll();
        return leads;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
const getInfoMatches = async () => {
    let tournaments = await db.getLeaderboardTournaments(1);
    //console.log(tournaments.Tournaments);

    tournaments = tournaments.Tournaments.map((t) => t.OverviewPage);
    //console.log(tournaments);

    let matches = [];
    for (let i = 0; i < tournaments.length; i++) {
        const t = tournaments[i];
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
                            t.Players = players;
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
    if (matches) {
        console.log(matches[0]);
        fs.writeFile(
            __dirname + "/data/matches/" + matches[0].ShownName + " " + matches[0]["DateTime UTC"].substring(0, 10) + ".json",
            JSON.stringify(matches),
            (err) => {
                if (err) console.log(err);
                else {
                    console.log("File written successfully\n");
                }
            }
        );
    }
    return matches;
};
