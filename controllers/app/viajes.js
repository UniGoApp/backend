const con = require("../database");

const obtenerViajes = async (req, res) => {
    const user_id = req.auth._id;
    if (req.auth._rol === "USER"){
        con.execute(
            'SELECT * FROM viajes WHERE status="ACTIVO" AND id_user!=? AND departure>CURRENT_DATE;', [user_id], (err, result) => {
                if (err) throw err;
                if(result.length === 0) return res.status(200).json({
                    info: 'No hay viajes registrados.',
                    data: '',
                    error: true
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

const publicarViajes = async (req, res) => {
    if(req.auth._rol === "USER"){
        con.execute(
            'INSERT INTO `viajes` (`id_user`,`origin`,`id_campus`,`price`,`seats`,`departure`,`comments`) VALUES (?, ?, ?, ?, ?, ?, ?);', [req.body.user_id, req.body.origen, req.body.id_campus, req.body.precio, req.body.plazas, req.body.salida, req.body.observaciones], (err, result) => {
                if (err) throw err;
                con.execute(
                    'SELECT * FROM `viajes` WHERE id = ?;', [result.insertId], (err, result2) => {
                        if (err) throw err;
                        if(result2.length === 0) return res.status(200).json({
                            info: 'No se encuentra el viaje con id: ' + result.insertId + '. ',
                            data: '',
                            error: true
                        });
                        return res.status(200).json({
                            error: false,
                            data: result2,
                            info: 'Viaje creado con éxito.'
                        });
                    }
                );
            }
        );
        
    }else{
        return res.status(403).json({
            info: 'Acceso no autorizado',
            data: '',
            error: ''
        });
    }
};

const modificarViajes = async (req, res) => {
    if (req.auth._rol === "USER"){
        con.execute(
            'UPDATE `viajes` SET `comments` = ? WHERE id = ? AND id_user = ?;', [req.body.observaciones, req.params.id,  req.body.id_usuario], (err, result) => {
                if (err) throw err;
                con.execute(
                    'SELECT * FROM `viajes` WHERE id = ?;', [req.params.id], (err, result) => {
                        if (err) throw err;
                        if(result.length === 0) return res.status(200).json({
                            info: 'No se encuentra el viaje con id: ' + req.params.id + '. ',
                            data: '',
                            error: true
                        });
                        return res.status(200).json({
                            error: false,
                            data: '',
                            info: 'Viaje modificado con éxito.'
                        });
                    }
                );
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

const borrarViajes = async (req, res) => {
    if (req.auth._rol === "USER" && req.auth._id === req.params.id){
        con.execute(
            'DELETE FROM `viajes` WHERE `id` = ? AND `id_user` = ? AND NOT status = ?;', [req.body.viaje_id, req.params.id, "EN CURSO"], (err, result) => {
                if (err) throw err;
                return res.status(200).json({
                    error: false,
                    data: result,
                    info: 'Viaje borrado con éxito.'
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

module.exports = { obtenerViajes, publicarViajes, modificarViajes, borrarViajes };