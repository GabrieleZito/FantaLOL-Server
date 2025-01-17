const { STRING, Model, INTEGER, BOOLEAN } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class LeaderboardTournaments extends Model {}

LeaderboardTournaments.init(
    {},
    {
        sequelize,
    }
);

module.exports = LeaderboardTournaments;
