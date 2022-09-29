const mysql = require('mysql2');
let con = null;

try{
    con = mysql.createConnection({
        host: "unigo-bd-1.cdytxndlnkpj.us-east-1.rds.amazonaws.com",
        user: "root",
        password: "unigoapp2022-Joseto",
        database: "unigodb-1",
        port: "3306"
    });
}catch(err){
    console.log('Error al conectar con la base de datos...');
}

module.exports = con;