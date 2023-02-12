const con = require("../database");

const obtenerUsuario = async (req, res) => {
    const user_id = req.params.id;
    con.execute(
        'SELECT u.id_campus, u.bio, u.creation_time, c.name AS campus, c.university, c.region, c.icon FROM usuarios AS u LEFT JOIN campus AS c ON c.id=u.id_campus WHERE u.id=?;', [user_id], (err, result1) => {
            if (err) throw err;
            if(result1.length === 0) return res.status(200).json({
                info: 'No existe el usuario solicitado.',
                data: '',
                error: true
            });
            con.execute(
                'SELECT * FROM valoraciones WHERE to_user=?;', [user_id], (err, result2) => {
                    if (err) throw err;
                    con.execute(
                        'SELECT * FROM viajes WHERE status=? AND id_user=?;', ['ACTIVO', user_id], (err, result3) => {
                            if (err) throw err;
                            return res.status(200).json({
                                error: false,
                                data: {
                                    user: result1[0],
                                    ratings: result2,
                                    trips: result3
                                },
                                info: ''
                            });
                        }
                    );
                }
            );
        }
    );
};

const modificarUsuario = async (req, res) => {
    if(req.params.id == req.auth._id){
        con.execute(
            'UPDATE usuarios SET password=?, username=?, phone=?, picture=? WHERE id=?;', [req.body.password, req.body.username, req.body.phone, req.body.picture, req.auth._id], (err, result) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        data: '',
                        info: 'No se ha podido modificar el usuario.'
                    });
                }
                return res.status(200).json({
                    error: false,
                    data: '',
                    info: 'Usuario modificado con éxito.'
                });
            }
        );
    }else{
        return res.status(403).json({
            error: false,
            data: '',
            info: 'No tienes permisos suficientes.'
        });
    }
};

const borrarUsuario = async (req, res) => {
    if(req.params.id == req.auth._id){
        con.execute(
            'DELETE FROM usuarios WHERE id=?;', [req.auth._id], (err, result) => {
                if (err) throw err;
                return res.status(200).json({
                    error: false,
                    data: 'Usuario borrado con éxito.',
                    info: ''
                });
            }
        );
    }else{
        return res.status(403).json({
            error: false,
            data: '',
            info: 'No tienes permisos suficientes.'
        });
    }
};

module.exports = { obtenerUsuario, modificarUsuario, borrarUsuario };