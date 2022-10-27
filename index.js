const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const compression = require('compression');

//routes
const router = require("./router");
const app = express();

// middlewares
app.use(compression());
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
//CORS options for admin panel
var corsOptions = {
    origin: 'https://www.unigoapp.es/admin'
}
app.use(cors());
app.use(morgan('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
}));

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// route middlewares
app.use(express.static('public'));
app.use("/", router);

const port = 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));