const con = require("../../database");
const bcrypt = require("bcryptjs");
const JWT_SECRET = 'CreacionDeTokensSegurosParaUsuarios_UnicarApp2022';

const getUsuarios = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN"){
        con.execute(
            'SELECT * FROM `usuarios` WHERE NOT `rol` = ?;',["SUPER_ADMIN"], (err, result) => {
                if (err) console.log('err :>> ', err);
                if(result.length === 0) return res.status(200).json({
                    msg: 'No hay usuarios registrados.',
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
    }else if(req.user._rol === "ADMIN"){
        con.execute(
            'SELECT * FROM `usuarios` WHERE `rol` = ?;', ["USER"], (err, result) => {
                if (err) console.log('err :>> ', err);
                if(result.length === 0) return res.status(200).json({
                    msg: 'No hay usuarios registrados.',
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
        return res.json({
            msg: 'Acceso no autorizado',
            data: '',
            info: ''
        });
    }
};

const postUsuarios = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'SELECT * FROM `usuarios` WHERE `email` = ? OR `phone` = ?;', [req.body.email, req.body.phone], (err, result) => {
                if (err) console.log('err :>> ', err);
                if(result.length !== 0){
                    return res.status(409).json({
                        msg: 'Email o teléfono en uso.',
                        data: '',
                        info: ''
                    });
                } else {
                    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
                    con.execute(
                        'INSERT INTO `usuarios` (`email`,`password`,`username`,`rol`,`phone`) VALUES (?, ?, ?, ?, ?);', [req.body.email, hashedPassword, req.body.username, req.body.rol, req.body.phone], (err, result) => {
                            if (err) console.log('err :>>', err);
                            con.execute(
                                'SELECT * FROM `usuarios` WHERE id = ?;', [result.insertId], (err, result2) => {
                                    if (err) console.log('err :>>', err);
                                    if(result2.length === 0) return res.status(200).json({
                                        msg: 'No se encuentra el usuario con id: ' + result.insertId + '.',
                                        data: '',
                                        info: ''
                                    });
                                    return res.status(200).json({
                                        msg: '',
                                        data: result2,
                                        info: 'Usuario creado con éxito.'
                                    });
                                }
                            );
                        }
                    );
                }
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

const putUsuarios = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'UPDATE `usuarios` SET `email` = ?,`password` = ?,`username` = ?,`rol` = ?,`phone` = ? WHERE id = ?;', [req.body.email, req.body.password, req.body.username, req.body.rol, req.body.phone, req.body.id], (err, result) => {
                if (err) console.log('err :>>', err);
                con.execute(
                    'SELECT * FROM `usuarios` WHERE id = ?;', [req.body.id], (err, result2) => {
                        if (err) console.log('err :>>', err);
                        if(result2.length === 0) return res.status(200).json({
                            msg: 'No se encuentra el usuario con id: ' + req.body.id + '.',
                            data: '',
                            info: ''
                        });
                        return res.status(200).json({
                            msg: '',
                            data: result2,
                            info: 'Usuario modificado con éxito.'
                        });
                    }
                );
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

const deleteUsuarios = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'DELETE FROM `usuarios` WHERE `id` = ?;', [req.body.id], (err, result) => {
                if (err) console.log('err :>>', err);
                return res.status(200).json({
                    msg: '',
                    data: result,
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

module.exports = { getUsuarios, postUsuarios, putUsuarios, deleteUsuarios };