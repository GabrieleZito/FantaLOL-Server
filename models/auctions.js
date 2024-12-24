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
        currentBidder: {
            type: INTEGER,
        },
    },
    {
        sequelize,
    }
);

module.exports = Auctions;
