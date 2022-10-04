const mysql = require('mysql2');
require('dotenv').config();

let con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_NAME,
    port: process.env.DB_PORT
});

con.connect(function(err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

module.exports = con;