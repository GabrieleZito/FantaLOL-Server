const { STRING, Model, INTEGER, BOOLEAN } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class TeamPlayers extends Model {}

TeamPlayers.init(
    {
        active: {
            type: BOOLEAN,
        },
    },
    {
        sequelize,
    }
);

module.exports = TeamPlayers;
