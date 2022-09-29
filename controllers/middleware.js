require('dotenv').config();
const expressJWT = require('express-jwt');

//MIDDLEWARE
const requireSignin = expressJWT({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
});

const invalidToken = (err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.send('<h1>301 error</h1>');
    } else {
        next();
    }
};

module.exports = { requireSignin, invalidToken };