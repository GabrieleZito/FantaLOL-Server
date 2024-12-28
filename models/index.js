const sequelize = require("../config/sequelize");
const UserProfile = require("./userProfile");
const Friendships = require("./friendships");
const Leaderboards = require("./leaderboards");
const Partecipations = require("./partecipations");
const Teams = require("./teams");
const Invites = require("./invites");
const Players = require("./players");
const Auctions = require("./auctions");
const Bids = require("./bids");
const TeamPlayers = require("./teamplayers");

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
Leaderboards.hasMany(Invites);
Invites.belongsTo(Leaderboards);
UserProfile.hasMany(Invites);
Invites.belongsTo(UserProfile);
UserProfile.hasMany(Invites, { foreignKey: "InvitedUserId" });
Invites.belongsTo(UserProfile);

Teams.belongsToMany(Players, { through: TeamPlayers });
Players.belongsToMany(Teams, { through: TeamPlayers });

Players.hasOne(Auctions);
Auctions.belongsTo(Players);

UserProfile.hasOne(Auctions);
Auctions.belongsTo(UserProfile);

Auctions.hasOne(Bids);
Bids.belongsTo(Auctions);

Leaderboards.hasOne(Auctions);
Auctions.belongsTo(Leaderboards);

UserProfile.hasOne(Bids);
Bids.belongsTo(UserProfile);

module.exports = {
    UserProfile,
    Friendships,
    Leaderboards,
    Partecipations,
    Teams,
    Invites,
    Auctions,
    Players,
    Bids,
    TeamPlayers,
};
