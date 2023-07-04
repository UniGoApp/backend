require('dotenv').config();
const {expressjwt} = require('express-jwt');

//MIDDLEWARE
const requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    onExpired: async (req, err) => {
        if (new Date() - err.inner.expiredAt < 5000) { return; }
        console.log(err);
        // throw err;
        // Send to frontend and using axios handle the special response sent here to logout the user
    }
});

module.exports = { requireSignin };