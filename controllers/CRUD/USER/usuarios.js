const con = require("../../database");

const obtenerUsuario = async (req, res) => {
    if(req.user._rol === "USER" && req.user._id === req.params.id){
        con.execute(
            'SELECT * FROM `usuarios` WHERE `rol` = ? AND `id` = ?;', ["USER", req.params.id], (err, result) => {
                if (err) throw err;
                if(result.length === 0) return res.status(200).json({
                    msg: 'No existe el usuario solicitado.',
                    data: '',
                    info: ''
                });
                return res.status(200).json({
                    msg: '',
                    data: result,
                    info: ''
                });
            }
        );
    }else{
        return res.status(403).json({
            msg: 'Acceso no autorizado',
            data: '',
            info: ''
        });
    }
};

const modificarUsuario = async (req, res) => {
    if(req.user._rol === "USER" && req.user._id === req.params.id){
        con.execute(
            'UPDATE `usuarios` SET `password` = ?,`username` = ?,`phone` = ?,`picture` = ? WHERE id = ?;', [req.body.password, req.body.username, req.body.phone, req.body.picture, req.params.id], (err, result) => {
                if (err) throw err;
                return res.status(200).json({
                    msg: '',
                    data: '',
                    info: 'Usuario modificado con éxito.'
                });
            }
        );
    }else {
        return res.status(403).json({
            msg: 'Acceso no autorizado',
            data: '',
            info: ''
        });
    }
};

const borrarUsuario = async (req, res) => {
    if(req.user._rol === "USER" && req.user._id === req.params.id){
        con.execute(
            'DELETE FROM `usuarios` WHERE `rol` = ? AND `id` = ?;', [req.user._rol, req.params.id], (err, result) => {
                if (err) throw err;
                return res.status(200).json({
                    msg: '',
                    data: '',
                    info: 'Usuario borrado con éxito.'
                });
            }
        );
    }else{
        return res.status(403).json({
            msg: 'Acceso no autorizado',
            data: '',
            info: ''
        });
    }
};

module.exports = { obtenerUsuario, modificarUsuario, borrarUsuario };