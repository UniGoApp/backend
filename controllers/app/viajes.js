const con = require("../database");

const obtenerViajes = async (req, res) => {
    if (req.user._rol === "USER"){
        con.execute(
            'SELECT * FROM `viajes` WHERE `status` = ?;', ["ACTIVO"], (err, result) => {
                if (err) throw err;
                if(result.length === 0) return res.status(200).json({
                    msg: 'No hay viajes registrados.',
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

const publicarViajes = async (req, res) => {
    if(req.user._rol === "USER"){
        con.execute(
            'INSERT INTO `viajes` (`id_user`,`origin`,`id_campus`,`price`,`seats`,`departure`,`comments`) VALUES (?, ?, ?, ?, ?, ?, ?);', [req.body.user_id, req.body.origen, req.body.id_campus, req.body.precio, req.body.plazas, req.body.salida, req.body.observaciones], (err, result) => {
                if (err) throw err;
                con.execute(
                    'SELECT * FROM `viajes` WHERE id = ?;', [result.insertId], (err, result2) => {
                        if (err) throw err;
                        if(result2.length === 0) return res.status(200).json({
                            msg: 'No se encuentra el viaje con id: ' + result.insertId + '. ',
                            data: '',
                            info: ''
                        });
                        return res.status(200).json({
                            msg: '',
                            data: result2,
                            info: 'Viaje creado con éxito.'
                        });
                    }
                );
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

const modificarViajes = async (req, res) => {
    if (req.user._rol === "USER"){
        con.execute(
            'UPDATE `viajes` SET `comments` = ? WHERE id = ? AND id_user = ?;', [req.body.observaciones, req.params.id,  req.body.id_usuario], (err, result) => {
                if (err) throw err;
                con.execute(
                    'SELECT * FROM `viajes` WHERE id = ?;', [req.params.id], (err, result) => {
                        if (err) throw err;
                        if(result.length === 0) return res.status(200).json({
                            msg: 'No se encuentra el viaje con id: ' + req.params.id + '. ',
                            data: '',
                            info: ''
                        });
                        return res.status(200).json({
                            msg: '',
                            data: '',
                            info: 'Viaje modificado con éxito.'
                        });
                    }
                );
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

const borrarViajes = async (req, res) => {
    if (req.user._rol === "USER" && req.user._id === req.params.id){
        con.execute(
            'DELETE FROM `viajes` WHERE `id` = ? AND `id_user` = ? AND NOT status = ?;', [req.body.viaje_id, req.params.id, "EN CURSO"], (err, result) => {
                if (err) throw err;
                return res.status(200).json({
                    msg: '',
                    data: result,
                    info: 'Viaje borrado con éxito.'
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

module.exports = { obtenerViajes, publicarViajes, modificarViajes, borrarViajes };