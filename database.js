const { UserProfile, UserAuth } = require("./models/");
const { verifyPassword } = require("./utils/misc");

exports.checkUser = (username, password) => {
    return new Promise(async (resolve, reject) => {
        const user = await UserAuth.findOne({ where: { username: username } });
        if (user) {
            if (await verifyPassword(password, user.passwordHash)) {
                //console.log("PAssword uguali");
                const user2 = await this.getUserById(user.id);
                console.log("USER2");

                //console.log(user2);
                resolve(user2);
            } else {
                const err = "Wrong Username or password";
                console.log(err);

                reject({ err });
            }
        } else {
            console.log("Nessun utente");
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
            console.log("USERINFO");
            console.log(userInfo[0].dataValues.UserProfile);
            const user = {
                id: userInfo[0].dataValues.id,
                email: userInfo[0].dataValues.email,
                username: userInfo[0].dataValues.username,
                firstName: userInfo[0].dataValues.UserProfile.firstName,
                lastname: userInfo[0].dataValues.UserProfile.lastname,
                birthDay: userInfo[0].dataValues.UserProfile.birthDay,
                bio: userInfo[0].dataValues.UserProfile.bio,
                profilePicture:
                    userInfo[0].dataValues.UserProfile.profilePicture,
            };

            resolve(user);
        }
        reject({ err: "Error retrieving userData" });
    });
};
