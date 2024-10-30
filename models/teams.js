const { INTEGER, STRING, Model, BOOLEAN } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Teams extends Model {}

Teams.init(
    {
        name: {
            type: STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
    }
);

module.exports = Teams;