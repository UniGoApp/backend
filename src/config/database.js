const mysql = require('mysql2');
require('dotenv').config();

let con = mysql.createConnection({
    host: process.env.AWS_RDS_HOST,
    port: process.env.AWS_RDS_PORT,
    user: process.env.AWS_RDS_USER,
    password: process.env.AWS_RDS_PASSWORD,
    database: process.env.AWS_RDS_DB_NAME
});

con.on('error', () => {
    console.log('Not connected to db...');
    con.destroy();
    con.connect(function(err) {
        if (err) {
            console.error('Database connection failed: ' + err.stack);
            return;
        }
        console.log('Connected to database.');
    });
});

module.exports = con;