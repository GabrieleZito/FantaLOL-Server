const { STRING, Model, INTEGER } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Auctions extends Model {}

Auctions.init(
    {
        status: {
            type: STRING,
        },
        currentBid: {
            type: INTEGER,
        },
        startTime: {
            type: INTEGER,
        },
        endTime: {
            type: INTEGER,
        },
    },
    {
        sequelize,
    }
);

module.exports = Auctions;
