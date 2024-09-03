const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize.js");
const UserProfile = require("./userProfile.js");

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
