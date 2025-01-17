const { STRING, Model } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Tournaments extends Model {}

Tournaments.init(
    {
        name: {
            type: STRING,
        },
        OverviewPage: {
            type: STRING,
        },
    },
    {
        sequelize,
    }
);

module.exports = Tournaments;
