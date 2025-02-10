const { DataTypes, Model, INTEGER } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class Points extends Model {}

Points.init(
    {
        points: {
            type: INTEGER,
        },
        description: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
    }
);
module.exports = Points;
