const cors = require("cors");
const morgan = require("morgan");
const compression = require('compression');
const express = require("express");
require('dotenv').config();

const routerWeb = require("./src/routes/web");
const routerAdmin = require("./src/routes/administration");
const routerApp = require("./src/routes/app");

const app = express();
const PORT = process.env.PORT || 3000;

// CONFIGURATION
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.static('public'));
app.use("/api", routerApp);
app.use("/admin", routerAdmin);
app.use("/", routerWeb);

// ERROR HANDLING
app.use(function (err, req, res, next) {
    if (err.message === 'UnauthorizedError') {
        res.status(401).json({error: true, data: 'Acceso no autorizado.'});
    }else if (err.message === 'InternalServerError'){
        res.status(500).json({error: true, data: 'Internal Server Error'});
    } else {
        res.redirect('/403');
    }
});

app.listen(PORT, () => console.log("ACCEPTING TRAFFIC")).on('error', () => console.log('error on listen'));