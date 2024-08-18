const { INTEGER, STRING, DATE, TEXT, DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
const { UserAuth } = require("./userAuth");

const UserProfile = sequelize.define("UserProfile", {
    userId: {
        type: INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: UserAuth,
            key: "id",
        },
    },
    firstName: {
        type: STRING,
    },
    lastName: {
        type: STRING,
    },
    birthDay: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    bio: {
        type: TEXT,
    },
    profilePicture: {
        type: STRING,
    },
});
(async () => {
    await UserProfile.sync();
})();

module.exports = { UserProfile };
