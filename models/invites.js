const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Invites extends Model {}

Invites.init(
    {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            primaryKey: true,
            autoIncrement: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ["UserProfileId", "InvitedUserId", "LeaderboardId"],
            },
        ],
        sequelize,
    }
);
module.exports = Invites;
