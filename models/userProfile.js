const { STRING, DATE, TEXT, Model } = require("sequelize");
const sequelize = require("../config/sequelize");

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
            defaultValue: "https://cdn-icons-png.flaticon.com/512/1177/1177568.png",
        },
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

module.exports = UserProfile;
