const mysql = require('mysql2');
import * as dotenv from 'dotenv';
dotenv.config();

let con = mysql.createConnection({
    host: "unigo-bd-1.cdytxndlnkpj.us-east-1.rds.amazonaws.com",
    user: "root",
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_NAME,
    port: "3306"
});

con.connect(function(err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    
    console.log('Connected to database.');
});

module.exports = con;