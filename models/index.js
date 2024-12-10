const UserAuth = require("./userAuth");
const UserProfile = require("./userProfile");
const Friendships = require("./friendships");
const Leaderboards = require("./leaderboards");
const Partecipations = require("./partecipations");
const Teams = require("./teams");
const sequelize = require("../config/sequelize");
const Invites = require("./invites");

UserAuth.hasOne(UserProfile, { onDelete: "cascade" });
UserProfile.belongsTo(UserAuth);
UserProfile.belongsToMany(UserProfile, { through: Friendships, as: "Friends" });
UserProfile.belongsToMany(Leaderboards, {
    through: Partecipations,
    as: "Partecipate",
});
Leaderboards.belongsToMany(UserProfile, {
    through: Partecipations,
    as: "Partecipate",
});
Leaderboards.belongsTo(UserProfile, { foreignKey: "createdBy", as: "Created" });
UserProfile.hasOne(Leaderboards, { foreignKey: "createdBy", as: "Created" });
Partecipations.belongsTo(Teams);
/* UserProfile.belongsToMany(UserProfile, {
    through: Invites,
    as: "Invite",
});*/
Leaderboards.hasMany(Invites);
Invites.belongsTo(Leaderboards); 
UserProfile.hasMany(Invites)
Invites.belongsTo(UserProfile)
UserProfile.hasMany(Invites, {foreignKey: "InvitedUserId"})
Invites.belongsTo(UserProfile)


module.exports = {
    UserAuth,
    UserProfile,
    Friendships,
    Leaderboards,
    Partecipations,
    Teams,
    Invites
};
