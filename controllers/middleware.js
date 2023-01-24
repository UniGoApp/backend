require('dotenv').config();
const expressJWT = require('express-jwt');

//MIDDLEWARE
const requireSignin = expressJWT({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    onExpired: async (req, err) => {
        if (new Date() - err.inner.expiredAt < 5000) { return; }
        console.log('Token has expired. Please sign in again.')
        throw err;
    }
});

module.exports = { requireSignin };