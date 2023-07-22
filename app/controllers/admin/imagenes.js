const con = require("../database");

const getUnisImg = async (req, res) => {
    if(req.auth._rol === "SUPER_ADMIN" || req.auth._rol === "ADMIN"){
        con.execute(
            'SELECT DISTINCT icon FROM campus;', (err, result) => {
                if (err) return res.status(200).json({
                    error: true,
                    info: 'No se puede procesar la peticion.',
                    data: ''
                });
                return res.status(200).json({
                    error: false,
                    info: '',
                    data: result
                });
            }
        );
    }else{
        return res.status(403).json({
            error: true,
            info: 'Acceso no autorizado',
            data: ''
        });
    }
};

const getUsersImg = async (req, res) => {
    if(req.auth._rol === "SUPER_ADMIN" || req.auth._rol === "ADMIN"){
        con.execute(
            'SELECT id, picture FROM usuarios;', (err, result) => {
                if (err) return res.status(200).json({
                    error: true,
                    info: 'No se puede procesar la peticion.',
                    data: ''
                });
                return res.status(200).json({
                    error: false,
                    info: '',
                    data: result
                });
            }
        );
    }else{
        return res.status(403).json({
            error: true,
            info: 'Acceso no autorizado',
            data: ''
        });
    }
};

module.exports = { getUnisImg, getUsersImg };