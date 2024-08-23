const UserAuth = require("./userAuth");
const UserProfile = require("./userProfile");

UserAuth.hasOne(UserProfile, { onDelete: "cascade" });
UserProfile.belongsTo(UserAuth);

module.exports = {
    UserAuth,
    UserProfile,
};
