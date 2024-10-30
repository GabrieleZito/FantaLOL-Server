const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Friendships extends Model {}

Friendships.init(
    {
        status: {
            type: DataTypes.TEXT,
        },
    },
    { sequelize }
);

module.exports = Friendships;
