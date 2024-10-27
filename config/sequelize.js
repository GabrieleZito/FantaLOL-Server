const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("fanta-lol-db", "user", "pass", {
    dialect: "sqlite",
    host: "./database.sqlite",
    logging: false,
});

module.exports = sequelize;
