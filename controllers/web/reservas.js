const con = require("../database");

const getReservas = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'SELECT * FROM reservas;', (err, result) => {
                if (err) throw err;
                if(result.length === 0) return res.status(200).json({
                    msg: 'No hay reservas registradas.',
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

const postReservas = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'INSERT INTO reservas (`id_viaje`,`id_usuario`,`leido`) VALUES (?, ?, ?);', [req.body.id_viaje, req.body.id_usuario, req.body.leido], (err, result) => {
                if (err) throw err;
                con.execute(
                    'SELECT * FROM reservas WHERE id = ?;', [result.insertId], (err, result2) => {
                        if (err) throw err;
                        if(result2.length === 0) return res.status(200).json({
                            msg: 'No se encuentra la reserva con id: ' + result.insertId + '.',
                            data: '',
                            info: ''
                        });
                        return res.status(200).json({
                            msg: '',
                            data: result2,
                            info: 'Reserva creada con éxito.'
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

const deleteReservas = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'DELETE FROM reservas WHERE id = ?;', [req.body.id], (err, result) => {
                if (err) throw err;
                return res.status(200).json({
                    msg: '',
                    data: result,
                    info: 'Reserva borrada con éxito.'
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

module.exports = { getReservas, postReservas, deleteReservas };