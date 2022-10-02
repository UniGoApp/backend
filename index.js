const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
var fs = require('fs');
var https = require('https');

//routes
const router = require("./router");
const app = express();
  
// middlewares
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// route middlewares
app.use(express.static('public'));
app.use("/", router);

const port = 80;
app.listen(port, () => console.log(`Server running on port ${port}`));

// const port = 443;
// https.createServer({
//     key: fs.readFileSync('./privatekey.pem'),
//   cert: fs.readFileSync('./server.crt')
//   },app).listen(port, function(){
//      console.log('Servidor https correindo en el puerto 443');
//  });