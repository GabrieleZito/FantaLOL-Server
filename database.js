const { UserProfile, UserAuth, Friendships } = require("./models/");
const { verifyPassword } = require("./utils/misc");
const sequelize = require("./config/sequelize");
const { Op, QueryTypes } = require("sequelize");

exports.checkUser = (username, password) => {
    return new Promise(async (resolve, reject) => {
        const user = await UserAuth.findOne({ where: { username: username } });
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
            console.log("Nessun utente");
            reject({ err: "Nessun Utente" });
        }
    });
};

exports.getUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        const userInfo = await UserAuth.findAll({
            where: { id: id },
            include: [{ model: UserProfile }],
        });
        if (userInfo) {
            //console.log("USERINFO");
            //console.log(userInfo[0].dataValues.UserProfile);
            const user = {
                id: userInfo[0].dataValues.id,
                email: userInfo[0].dataValues.email,
                username: userInfo[0].dataValues.username,
                firstName: userInfo[0].dataValues.UserProfile.firstName,
                lastName: userInfo[0].dataValues.UserProfile.lastName,
                birthDay: userInfo[0].dataValues.UserProfile.birthDay,
                bio: userInfo[0].dataValues.UserProfile.bio,
                profilePicture:
                    userInfo[0].dataValues.UserProfile.profilePicture,
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
            "Select UserProfiles.id, UserAuths.username, UserProfiles.profilePicture FROM UserProfiles, Friendships, UserAuths where Friendships.UserProfileId = UserProfiles.id and Friendships.FriendId = ? and Friendships.UserProfileId = UserAuths.id and status = 'pending'",
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
            console.log(row);
            row.status = "accepted";
            await row.save();
            return { msg: "Friend request Accepted" };
        } else {
            console.log("ERRORE");
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
                    const friendId =
                        id == f.UserProfileId ? f.FriendId : f.UserProfileId;
                    const friend = await UserProfile.findOne({
                        where: {
                            id: friendId,
                        },
                        include: { model: UserAuth, attributes: {exclude: ["passwordHash"]} },
                    });
                    console.log(friend);

                    return friend;
                })
            );
            console.log(friends);
            return friends;
        }
    } catch (error) {
        throw error;
    }
};
