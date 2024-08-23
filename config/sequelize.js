const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("fanta-lol-db", "user", "pass", {
    dialect: "sqlite",
    host: "./database.sqlite",
});

module.exports = sequelize;
