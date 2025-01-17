const { STRING, Model } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Teams extends Model {}

Teams.init(
    {
        name: {
            type: STRING,
        },
    },
    {
        sequelize,
    }
);

module.exports = Teams;
