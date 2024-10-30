const { INTEGER, STRING, Model, BOOLEAN } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Partecipations extends Model {}

Partecipations.init(
    {
        coins: {
            type: INTEGER,
            allowNull: false
        },
        score:{
            type: INTEGER,
            defaultValue: 0,
        },

    },
    {
        sequelize,
    }
);

module.exports = Partecipations;