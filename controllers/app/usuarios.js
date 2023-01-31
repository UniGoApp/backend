const con = require("../database");

const obtenerUsuario = async (req, res) => {
    if(req.auth._rol === "USER" && req.auth._id === req.params.id){
        con.execute(
            'SELECT * FROM `usuarios` WHERE `rol` = ? AND `id` = ?;', ["USER", req.params.id], (err, result) => {
                if (err) throw err;
                if(result.length === 0) return res.status(200).json({
                    info: 'No existe el usuario solicitado.',
                    data: '',
                    error: false
                });
                return res.status(200).json({
                    error: false,
                    data: result,
                    info: ''
                });
            }
        );
    }else{
        return res.status(403).json({
            info: 'Acceso no autorizado',
            data: '',
            error: true
        });
    }
};

const modificarUsuario = async (req, res) => {
    if(req.auth._rol === "USER" && req.auth._id === req.params.id){
        con.execute(
            'UPDATE `usuarios` SET `password` = ?,`username` = ?,`phone` = ?,`picture` = ? WHERE id = ?;', [req.body.password, req.body.username, req.body.phone, req.body.picture, req.params.id], (err, result) => {
                if (err) throw err;
                return res.status(200).json({
                    error: false,
                    data: '',
                    info: 'Usuario modificado con éxito.'
                });
            }
        );
    }else {
        return res.status(403).json({
            info: 'Acceso no autorizado',
            data: '',
            error: true
        });
    }
};

const borrarUsuario = async (req, res) => {
    if(req.auth._rol === "USER" && req.auth._id === req.params.id){
        con.execute(
            'DELETE FROM `usuarios` WHERE `rol` = ? AND `id` = ?;', [req.auth._rol, req.params.id], (err, result) => {
                if (err) throw err;
                return res.status(200).json({
                    error: false,
                    data: '',
                    info: 'Usuario borrado con éxito.'
                });
            }
        );
    }else{
        return res.status(403).json({
            info: 'Acceso no autorizado',
            data: '',
            error: true
        });
    }
};

module.exports = { obtenerUsuario, modificarUsuario, borrarUsuario };