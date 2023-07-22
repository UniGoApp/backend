const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const compression = require('compression');
require('dotenv').config();

const routerWeb = require("./app/routes/web");
const routerApp = require("./app/routes/app");

const app = express();
const PORT = process.env.PORT || 3000;
// middlewares
app.use(compression());
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Only log error responses
app.use(morgan('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
}));
app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.static('public'));
app.use("/api", routerApp);
app.use("/", routerWeb);

app.listen(PORT, () => console.log("ACCEPTING TRAFFIC")).on('error', () => console.log('error on listen'));