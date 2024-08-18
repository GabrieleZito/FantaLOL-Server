const { INTEGER, STRING } = require("sequelize");
const { sequelize } = require("../config/dbConnect");

const UserAuth = sequelize.define(
    "UserAuth",
    {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        passwordHash: {
            type: STRING,
            allowNull: false,
        },
        salt: {
            type: STRING,
            allowNull: false,
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
    },
    { freezeTableName: true }
);
(async () => {
    await UserAuth.sync();
})();

module.exports = { UserAuth };
