const { Model } = require("sequelize");
const sequelize = require("../config/sequelize.js");

class TeamPoints extends Model {}

TeamPoints.init(
    {},
    {
        sequelize,
    }
);

module.exports = TeamPoints;
