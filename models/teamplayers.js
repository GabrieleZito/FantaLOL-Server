const { STRING, Model, INTEGER } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class TeamPlayers extends Model {}

TeamPlayers.init(
    {},
    {
        sequelize,
    }
);

module.exports = TeamPlayers;
