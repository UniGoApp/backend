const con = require("../database");

const obtenerReserva = async (req, res) => {
    con.execute(
        'SELECT * FROM viajes INNER JOIN reservas where viajes.id = reservas.id_viaje AND reservas.id_usuario = ?;', [req.user._id], (err, result) => {
            if (err) throw err;
            if(result.length === 0) {
                return res.status(200).json({info: 'No hay reservas registradas.'});
            }else{
                return res.status(200).json({
                    msg: '',
                    data: result,
                    info: ''
                });
            }
        }
    );
};

const obtenerReservas = async (req, res) => {
    con.execute(
        'SELECT * FROM reservas where id_usuario = ?;', [req.params._id], (err, result) => {
            if (err) throw err;
            if(result.length === 0) {
                return res.status(200).json({info: 'No hay reservas registradas.'});
            }else{
                return res.status(200).json({
                    msg: '',
                    data: result,
                    info: ''
                });
            }
        }
    );
};

module.exports = { obtenerReserva, obtenerReservas };