const mysql = require('mysql2');
let con = null;

try{
    con = mysql.createConnection({
        host: "127.0.0.1",
        user: "unicar_root",
        password: "unicar_root@2022joseto",
        database: "unicardb",
        port: "3305"
    });
}catch(err){
    console.log('Error al conectar con la base de datos...');
}

module.exports = con;