const { STRING, Model, INTEGER } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Bids extends Model {}

Bids.init(
    {
        bid: {
            type: INTEGER,
        },
    },
    {
        sequelize,
    }
);

module.exports = Bids;
