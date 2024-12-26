const { UserProfile, Friendships, Leaderboards, Partecipations, Invites, Teams, Auctions, Bids, Players } = require("./models/");
const { verifyPassword } = require("./utils/misc");
const sequelize = require("./config/sequelize");
const { Op, QueryTypes, where } = require("sequelize");
const fs = require("fs");

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
//TODO togliere informazioni sensibili
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
            tournamentId: 1,
        });
        const team = await Teams.create({});
        const part = await Partecipations.create({
            coins: leaderboard.max_coins,
            score: 0,
            UserProfileId: data.idUser,
            LeaderboardId: leaderboard.id,
            TeamId: team.id,
        });
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
            },
        });
        //console.log(invites);

        return invites;
    } catch (error) {
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

//TODO togliere info non necessarie da UserProfile
exports.getFriendLeaderboards = async (id) => {
    try {
        //const user = await UserProfile.findByPk(id);
        const leads = await UserProfile.findAll({
            where: {
                id: id,
            },
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
            if (fs.existsSync(__dirname + "/liquipedia/lec_players.json")) {
                //console.log("dentro if");

                let file = fs.readFileSync(__dirname + "/liquipedia/lec_players.json");
                file = JSON.parse(file);
                //console.log(file.data[0].id);

                file.data.forEach((p) => {
                    if (p && p.id == result.Player.name) {
                        result.Player = p;
                    }
                });
            }
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
        await auction.update({ status: "closed", currentBid: maxBid });
        return auction;
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
