const { INTEGER, STRING, DATE, TEXT, DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");
const { UserAuth } = require("./userAuth");

class UserProfile extends Model {}

UserProfile.init(
    {
        firstName: {
            type: STRING,
            defaultValue: "",
        },
        lastName: {
            type: STRING,
            defaultValue: "",
        },
        birthDay: {
            type: DATE,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        },
        bio: {
            type: TEXT,
            defaultValue: "",
        },
        profilePicture: {
            type: STRING,
            defaultValue: "",
        },
    },
    {
        sequelize,
    }
);

module.exports = UserProfile;
