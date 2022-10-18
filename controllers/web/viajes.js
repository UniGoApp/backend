const con = require("../database");

const getViajes = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'SELECT U.email, U.phone, U.username, V.* FROM usuarios U inner join viajes V on U.id = V.id_usuario;', (err, result) => {
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

const postViajes = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'INSERT INTO `viajes` (`id_usuario`, `origen`,`id_campus`,`precio`,`plazas`,`salida`,`observaciones`,`estado`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);', [req.body.id_usuario, req.body.origen, req.body.id_campus, req.body.precio, req.body.plazas, req.body.salida, req.body.observaciones, req.body.estado], (err, result) => {
                if (err) throw err;
                con.execute(
                    'SELECT * FROM `viajes` WHERE id = ?;', [result.insertId], (err, result2) => {
                        if (err) throw err;
                        if(result2.length === 0) return res.status(200).json({
                            msg: 'No se encuentra el viaje con id: ' + result.insertId + '.',
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

const putViajes = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'UPDATE `viajes` SET `estado` = ? WHERE id = ?;', [req.body.estado, req.body.viaje_id], (err, result) => {
                if (err) throw err;
                con.execute(
                    'SELECT * FROM `viajes` WHERE id = ?;', [req.body.id], (err, result2) => {
                        if (err) throw err;
                        if(result2.length === 0) return res.status(200).json({
                            msg: 'No se encuentra el viaje con id: ' + req.body.id + '.',
                            data: '',
                            info: ''
                        });
                        return res.status(200).json({
                            msg: '',
                            data: result2,
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

const deleteViajes = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'DELETE FROM `viajes` WHERE `id` = ?;', [req.body.id], (err, result) => {
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

module.exports = { getViajes, postViajes, putViajes, deleteViajes };