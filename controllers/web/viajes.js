const con = require("../database");

const getViajes = async (req, res) => {
    if(req.auth._rol === "SUPER_ADMIN" || req.auth._rol === "ADMIN"){
        con.execute(
            'SELECT U.email, U.phone, U.username, V.* FROM usuarios U inner join viajes V on U.id = V.id_user;', (err, result) => {
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
    if(req.auth._rol === "SUPER_ADMIN" || req.auth._rol === "ADMIN"){
        let dateTime = new Date().toJSON().split('T');
        let date = dateTime[0].replaceAll('-','');
        let time = dateTime[1].split('.')[0].replaceAll(':','');
        let id = `v_${date}_${time}`;
        con.execute(
            'INSERT INTO viajes (`id`, `id_user`, `origin`,`id_campus`,`price`,`seats`,`departure`,`comments`,`status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);', [id, req.body.id_usuario, req.body.origen, req.body.id_campus, req.body.precio, req.body.plazas, req.body.salida, req.body.observaciones, req.body.estado], (err, result) => {
                if (err) console.log(err);
                con.execute(
                    'SELECT * FROM viajes WHERE id = ?;', [id], (err, result2) => {
                        if(err || result2.length === 0) return res.status(200).json({
                            error: true,
                            info: 'No se encuentra el viaje con id: ' + id + '.',
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
    if(req.auth._rol === "SUPER_ADMIN" || req.auth._rol === "ADMIN"){
        con.execute(
            'UPDATE viajes SET `comments`= ?,`status` = ? WHERE id = ?;', [req.body.observaciones, req.body.estado, req.params.id], (err, result) => {
                if (err) console.log(err);
                con.execute(
                    'SELECT * FROM viajes WHERE id = ?;', [req.params.id], (err, result2) => {
                        if (err) console.log(err);
                        if(result2.length === 0) return res.status(200).json({
                            error: true,
                            info: 'No se encuentra el viaje con id: ' + req.params.id + '.',
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
    if(req.auth._rol === "SUPER_ADMIN" || req.auth._rol === "ADMIN"){
        con.execute(
            'DELETE FROM viajes WHERE `id` = ?;', [req.params.id], (err, result) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        info: 'Este viaje no se ha podido borrar.',
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