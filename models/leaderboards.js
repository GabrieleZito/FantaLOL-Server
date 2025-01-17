const { INTEGER, STRING, Model, BOOLEAN } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Leaderboards extends Model {}

Leaderboards.init(
    {
        name: {
            type: STRING,
            allowNull: false,
            unique: true,
        },
        private: {
            type: BOOLEAN,
            allowNull: false,
        },
        fee: {
            type: INTEGER,
            allowNull: false,
        },
        max_coins: {
            type: INTEGER,
        },
    },
    {
        sequelize,
    }
);

module.exports = Leaderboards;
