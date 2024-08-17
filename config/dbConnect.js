const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("fanta-lol-db", "user", "pass", {
    dialect: "sqlite",
    host: "./database.sqlite",
});

const dbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("DB connesso");
    } catch (e) {
        console.log("Error: " + e);
    }
};

module.exports = { dbConnection, sequelize };
