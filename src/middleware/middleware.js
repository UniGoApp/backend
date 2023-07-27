require('dotenv').config();
const {expressjwt} = require('express-jwt');

//MIDDLEWARE
const requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
    // onExpired: async (req, err) => {
    //     if (new Date() - err.inner.expiredAt < 5000) { return; }
    //     const e = new Error("El token de acceso no es válido."); // e.name is 'Error', e.message is 'ExpiredTokenError'
    //     e.name = "ExpiredTokenError";
    //     throw e;
    // }
});

const isValidAdmin = (req, res, next) => {
    if(!(req.auth._role === "ADMIN" || req.auth._role === "SUPER_ADMIN")) throw new Error('UnauthorizedError');
    else next();
};

module.exports = { requireSignin, isValidAdmin };