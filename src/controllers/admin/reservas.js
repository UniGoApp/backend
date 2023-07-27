const con = require("../../config/database");
const { idMaker } = require("../../utils/idMaker");

const getReservas = async (req, res) => {
    con.execute('SELECT * FROM reservas;', (err, result) => {
        if (err) throw new Error('InternalServerError');
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
    });
};

const postReservas = async (req, res) => {
    let id = idMaker('b');
    con.execute('INSERT INTO reservas (id,id_trip,id_user,num_seats,read,scored) VALUES (?, ?, ?, ?, ?, ?);', [id, req.body.id_viaje, req.body.id_usuario, req.body.plazas, req.body.leido, req.body.valorado], (err, result) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: 'Reserva creada con éxito.',
            data: ''
        });
    });
};

const putReservas = async (req, res) => {
    con.execute('UPDATE reservas SET `id_trip`=?, `id_user`=?, `num_seats`=?, `read`=?, `scored`=? WHERE id=?;', [req.body.id_trip, req.body.id_user, req.body.num_seats, req.body.read, req.body.scored, req.params.id], (err, result) => {
        if(err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: 'Reserva modificada con éxito.',
            data: ''
        });
    });
};

const deleteReservas = async (req, res) => {
    con.execute('DELETE FROM reservas WHERE id = ?;', [req.params.id], (err, result) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: 'Reserva borrada con éxito.',
            data: ''
        });
    });
};

module.exports = { getReservas, postReservas, putReservas, deleteReservas };