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
                    let dateTime = new Date().toJSON().split('T');
                    let date = dateTime[0].replaceAll('-','');
                    let time = dateTime[1].split('.')[0].replaceAll(':','');
                    let id = `u_${date}_${time}`;
                    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
                    con.execute(
                        'INSERT INTO usuarios (`id`,`email`,`password`,`username`,`rol`,`phone`,`rrss`) VALUES (?, ?, ?, ?, ?, ?, ?);', [id, req.body.email, hashedPassword, req.body.username, req.body.rol, req.body.phone, req.body.rrss], (err, result) => {
                            if (err) console.log('err :>>', err);
                            con.execute(
                                'SELECT * FROM usuarios WHERE id = ?;', [id], (err, result2) => {
                                    if (err) console.log('err :>>', err);
                                    if(result2.length === 0) return res.status(200).json({
                                        error: true,
                                        info: 'No se encuentra el usuario con id: ' + id + '.',
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
            'UPDATE usuarios SET `email` = ?,`username` = ?,`rol` = ?,`phone` = ?,`picture` = ?,`resetCode` = ?,`creation_time` = ?,`rrss` = ? WHERE id = ?;', [req.body.email, req.body.username, req.body.rol, req.body.phone, req.body.picture, req.body.resetCode, req.body.creation_time, req.body.rrss, req.params.id], (err, result) => {
                if (err) console.log('err :>>', err);
                con.execute(
                    'SELECT * FROM usuarios WHERE id = ?;', [req.params.id], (err, result2) => {
                        if (err) console.log('err :>>', err);
                        if(result2.length === 0) return res.status(200).json({
                            error: true,
                            info: 'No se encuentra el usuario con id: ' + req.params.id + '.',
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
            'DELETE FROM usuarios WHERE id = ?;', [req.params.id], (err, result) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        info: 'Este usuario no se ha podido borrar.',
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