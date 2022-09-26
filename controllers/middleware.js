
const expressJWT = require('express-jwt');

const JWT_SECRET = 'CreacionDeTokensSegurosParaUsuarios_UnicarApp2022';

//MIDDLEWARE
const requireSignin = expressJWT({
    secret: JWT_SECRET,
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