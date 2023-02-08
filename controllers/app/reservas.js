const con = require("../database");

const obtenerReserva = async (req, res) => {
    const user_id = req.auth._id;
    const reserva_id = req.params.id;
    con.execute(
        `SELECT r.*, v.*, c.name AS campus, c.university, c.region, c.icon FROM reservas AS r
        INNER JOIN viajes AS v ON r.id_trip=v.id
        INNER JOIN campus AS c ON c.id=v.id_campus WHERE r.id_user=? AND r.id=?;`, [user_id,reserva_id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(200).json({error: true, info: 'Error inesperado en la base de datos.', data:''});
            }
            if(result.length === 0) {
                return res.status(200).json({error: true, info: 'No hay reservas registradas.', data:''});
            }else{
                return res.status(200).json({
                    error: false,
                    info: '',
                    data: result
                });
            }
        }
    );
};

const obtenerReservas = async (req, res) => {
    const user_id = req.auth._id;
    con.execute(
        'SELECT r.*, v.origin, v.id_campus, v.departure, c.name AS campus, c.university, c.icon FROM reservas AS r INNER JOIN viajes AS v ON r.id_trip=v.id INNER JOIN campus AS c ON v.id_campus=c.id WHERE r.id_user=?', [user_id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(200).json({error: true, info: 'Error inesperado en la base de datos.', data:''});
            }
            if(result.length === 0) {
                return res.status(200).json({error:true, info: 'No hay reservas registradas.', data:''});
            }else{
                return res.status(200).json({
                    error: false,
                    info: '',
                    data: result
                });
            }
        }
    );
};

module.exports = { obtenerReserva, obtenerReservas };