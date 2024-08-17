const { Sequelize, DataTypes, STRING } = require("sequelize");
const { sequelize } = require("../config/dbConnect");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
});
(async () => {
    await User.sync();
    // Code here
})();

module.exports = { User };
