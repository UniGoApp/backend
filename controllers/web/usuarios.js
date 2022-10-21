const con = require("../database");
const bcrypt = require("bcryptjs");

const getUsuarios = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN"){
        con.execute(
            'SELECT * FROM usuarios WHERE NOT rol = ?;',["SUPER_ADMIN"], (err, result) => {
                if (err) console.log('err :>> ', err);
                if(result.length === 0) return res.status(200).json({
                    error: true,
                    info: 'No hay usuarios registrados.',
                    data: ''
                });
                return res.status(200).json({
                    error: false,
                    info: '',
                    data: result
                });
            }
        );
    }else if(req.user._rol === "ADMIN"){
        con.execute(
            'SELECT * FROM usuarios WHERE rol = ?;', ["USER"], (err, result) => {
                if (err) console.log('err :>> ', err);
                if(result.length === 0) return res.status(200).json({
                    error: true,
                    info: 'No hay usuarios registrados.',
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
        return res.json({
            error: true,
            info: 'Acceso no autorizado',
            data: ''
        });
    }
};

const postUsuarios = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'SELECT * FROM usuarios WHERE email = ? OR `phone` = ?;', [req.body.email, req.body.phone], (err, result) => {
                if (err) console.log('err :>> ', err);
                if(result.length !== 0){
                    return res.status(409).json({
                        error: true,
                        info: 'Email o teléfono en uso.',
                        data: ''
                    });
                } else {
                    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
                    con.execute(
                        'INSERT INTO usuarios (`email`,`password`,`username`,`rol`,`phone`) VALUES (?, ?, ?, ?, ?);', [req.body.email, hashedPassword, req.body.username, req.body.rol, req.body.phone], (err, result) => {
                            if (err) console.log('err :>>', err);
                            con.execute(
                                'SELECT * FROM usuarios WHERE id = ?;', [result.insertId], (err, result2) => {
                                    if (err) console.log('err :>>', err);
                                    if(result2.length === 0) return res.status(200).json({
                                        error: true,
                                        info: 'No se encuentra el usuario con id: ' + result.insertId + '.',
                                        data: ''
                                    });
                                    return res.status(200).json({
                                        error: false,
                                        info: 'Usuario creado con éxito.',
                                        data: result2
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
            error: true,
            info: 'Acceso no autorizado',
            data: ''
        });
    }
};

const putUsuarios = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'UPDATE usuarios SET `email` = ?,`password` = ?,`username` = ?,`rol` = ?,`phone` = ? WHERE id = ?;', [req.body.email, req.body.password, req.body.username, req.body.rol, req.body.phone, req.body.id], (err, result) => {
                if (err) console.log('err :>>', err);
                con.execute(
                    'SELECT * FROM usuarios WHERE id = ?;', [req.body.id], (err, result2) => {
                        if (err) console.log('err :>>', err);
                        if(result2.length === 0) return res.status(200).json({
                            error: true,
                            info: 'No se encuentra el usuario con id: ' + req.body.id + '.',
                            data: ''
                        });
                        return res.status(200).json({
                            error: false,
                            info: 'Usuario moficado con éxito.',
                            data: result2
                        });
                    }
                );
            }
        );
    }else {
        return res.status(403).json({
            error: true,
            info: 'Acceso no autorizado',
            data: ''
        });
    }
};

const deleteUsuarios = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'DELETE FROM usuarios WHERE id = ?;', [req.body.id], (err, result) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        info: 'Usuario no se ha podido borrar. Por favor vuelva a intentarlo mas tarde o contacte con contaco@unigoapp.es.',
                        data: ''
                    });
                }
                return res.status(200).json({
                    error: false,
                    info: 'Usuario borrado con éxito.',
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

module.exports = { getUsuarios, postUsuarios, putUsuarios, deleteUsuarios };