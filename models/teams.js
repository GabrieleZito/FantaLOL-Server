const { INTEGER, STRING, Model, BOOLEAN } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Teams extends Model {}

Teams.init(
    {
        name: {
            type: STRING,
        },
        top1: {
            type: STRING,
        },
        top2: {
            type: STRING,
        },
        jng1: {
            type: STRING,
        },
        jng2: {
            type: STRING,
        },
        mid1: {
            type: STRING,
        },
        mid2: {
            type: STRING,
        },
        bot1: {
            type: STRING,
        },
        bot2: {
            type: STRING,
        },
        sup1: {
            type: STRING,
        },
        sup2: {
            type: STRING,
        },
    },
    {
        sequelize,
    }
);

module.exports = Teams;
