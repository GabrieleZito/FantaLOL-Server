const { STRING, Model } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Players extends Model {}

Players.init(
    {
        name: {
            type: STRING,
        },
        longName: {
            type: STRING,
        },
        role: {
            type: STRING,
        },
    },
    {
        sequelize,
    }
);

module.exports = Players;
