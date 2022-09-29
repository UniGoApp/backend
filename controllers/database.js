const mysql = require('mysql2');

let con = mysql.createConnection({
    host: "unigo-bd-1.cdytxndlnkpj.us-east-1.rds.amazonaws.com",
    user: "root",
    password: "unigoapp2022-Joseto",
    database: "unigodb-1",
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