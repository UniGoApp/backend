const con = require("../database");

const getViajes = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'SELECT U.email, U.phone, U.username, V.* FROM usuarios U inner join viajes V on U.id = V.id_usuario;', (err, result) => {
                if (err) console.log(err);
                if(result.length === 0) return res.status(200).json({
                    error: true,
                    info: 'No hay viajes registrados.',
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

const postViajes = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'INSERT INTO viajes (`id_usuario`, `origen`,`id_campus`,`precio`,`plazas`,`salida`,`observaciones`,`estado`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);', [req.body.id_usuario, req.body.origen, req.body.id_campus, req.body.precio, req.body.plazas, req.body.salida, req.body.observaciones, req.body.estado], (err, result) => {
                if (err) console.log(err);
                con.execute(
                    'SELECT * FROM viajes WHERE id = ?;', [result.insertId], (err, result2) => {
                        if (err) console.log(err);
                        if(result2.length === 0) return res.status(200).json({
                            error: true,
                            info: 'No se encuentra el viaje con id: ' + result.insertId + '.',
                            data: ''
                        });
                        return res.status(200).json({
                            error: false,
                            info: 'Viaje creado con éxito.',
                            data: result2
                        });
                    }
                );
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

const putViajes = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'UPDATE viajes SET `estado` = ? WHERE id = ?;', [req.body.estado, req.body.viaje_id], (err, result) => {
                if (err) console.log(err);
                con.execute(
                    'SELECT * FROM `viajes` WHERE id = ?;', [req.body.id], (err, result2) => {
                        if (err) console.log(err);
                        if(result2.length === 0) return res.status(200).json({
                            error: true,
                            info: 'No se encuentra el viaje con id: ' + req.body.id + '.',
                            data: ''
                        });
                        return res.status(200).json({
                            error: false,
                            info: 'Viaje moficado con éxito.',
                            data: result2
                        });
                    }
                );
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

const deleteViajes = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'DELETE FROM viajes WHERE `id` = ?;', [req.body.id], (err, result) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        info: 'Viaje no se ha podido borrar. Por favor vuelva a intentarlo mas tarde o contacte con contaco@unigoapp.es.',
                        data: ''
                    });
                }
                return res.status(200).json({
                    error: false,
                    info: 'Viaje borrado con éxito.',
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

module.exports = { getViajes, postViajes, putViajes, deleteViajes };