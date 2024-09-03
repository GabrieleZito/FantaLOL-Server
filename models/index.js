const UserAuth = require("./userAuth");
const UserProfile = require("./userProfile");
const Friendships = require("./friendships");

UserAuth.hasOne(UserProfile, { onDelete: "cascade" });
UserProfile.belongsTo(UserAuth);
UserProfile.belongsToMany(UserProfile, { through: Friendships, as: "Friends" });

module.exports = {
    UserAuth,
    UserProfile,
    Friendships,
};
