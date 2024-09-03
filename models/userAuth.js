const { INTEGER, STRING, Model } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class UserAuth extends Model {}

UserAuth.init(
    {
        email: {
            type: STRING,
            allowNull: false,
            unique: true,
        },
        username: {
            type: STRING,
            allowNull: false,
            unique: true,
        },
        passwordHash: {
            type: STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
    }
);

module.exports = UserAuth;
