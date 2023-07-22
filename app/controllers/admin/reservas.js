const con = require("../database");

const getReservas = async (req, res) => {
    if(req.auth._rol === "SUPER_ADMIN" || req.auth._rol === "ADMIN"){
        con.execute(
            'SELECT * FROM reservas;', (err, result) => {
                if (err) console.log(err);
                if(result.length === 0) return res.status(200).json({
                    error: true,
                    info: 'No hay reservas registradas.',
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

const putReservas = async (req, res) => {
    if(req.auth._rol === "SUPER_ADMIN" || req.auth._rol === "ADMIN"){
        con.execute(
            'UPDATE reservas SET `id_trip`=?, `id_user`=?, `num_seats`=?, `read`=?, `scored`=? WHERE id=?;', [req.body.id_trip, req.body.id_user, req.body.num_seats, req.body.read, req.body.scored, req.params.id], (err, result) => {
                console.log('err :>> ', err);
                if(err) return res.status(200).json({
                    error: true,
                    info: 'No se ha podido modificar la reserva.',
                    data: ''
                });
                return res.status(200).json({
                    error: false,
                    info: 'Reserva modificada con éxito.',
                    data: ''
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

const postReservas = async (req, res) => {
    if(req.auth._rol === "SUPER_ADMIN" || req.auth._rol === "ADMIN"){
        let dateTime = new Date().toJSON().split('T');
        let date = dateTime[0].replaceAll('-','');
        let time = dateTime[1].split('.')[0].replaceAll(':','');
        let id = `r_${date}_${time}`;
        con.execute(
            'INSERT INTO reservas (id,id_trip,id_user,num_seats,read,scored) VALUES (?, ?, ?, ?, ?, ?);', [id, req.body.id_viaje, req.body.id_usuario, req.body.plazas, req.body.leido, req.body.valorado], (err, result) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        info: 'No se ha podido procesar la petición.',
                        data: ''
                    });
                };
                con.execute(
                    'SELECT * FROM reservas WHERE id = ?;', [id], (err, result2) => {
                        if(err || result2.length === 0) return res.status(200).json({
                            error: true,
                            info: 'No se encuentra la reserva con id: ' + id + '.',
                            data: ''
                        });
                        return res.status(200).json({
                            error: false,
                            info: 'Reserva creada con éxito.',
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

const deleteReservas = async (req, res) => {
    if(req.auth._rol === "SUPER_ADMIN" || req.auth._rol === "ADMIN"){
        con.execute(
            'DELETE FROM reservas WHERE id = ?;', [req.params.id], (err, result) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        info: 'No se ha podido borrar la reserva.',
                        data: ''
                    });
                }
                return res.status(200).json({
                    error: false,
                    info: 'Reserva borrada con éxito.',
                    data: ''
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

module.exports = { getReservas, putReservas, postReservas, deleteReservas };