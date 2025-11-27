const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config(); 

console.log("DB_USER:", process.env.DB_USER); 

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
