require('dotenv').config();
const {expressjwt} = require('express-jwt');

//MIDDLEWARE
const requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    onExpired: async (req, err) => {
        if (new Date() - err.inner.expiredAt < 5000) { return; }
        throw err;
    }
});

module.exports = { requireSignin };