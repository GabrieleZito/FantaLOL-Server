const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "world",
});

//console.log(pool);

const result = await pool.query("Select * from country");

console.log(result);
