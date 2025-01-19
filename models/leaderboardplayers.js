const { STRING, Model, INTEGER, BOOLEAN } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class LeaderboardPlayers extends Model {}

LeaderboardPlayers.init(
    {},
    {
        sequelize,
    }
);

module.exports = LeaderboardPlayers;
