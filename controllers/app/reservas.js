const con = require("../database");

const obtenerReservas = async (req, res) => {
    if(req.user._rol === "USER" || req.user._rol === "ADMIN" || req.user._rol === "SUPER_ADMIN"){
        con.execute(
            'SELECT * FROM viajes INNER JOIN reservas where viajes.id = reservas.id_viaje AND reservas.id_usuario = ?;', [req.user._id], (err, result) => {
                if (err) throw err;
                if(result.length === 0) {
                    return res.status(200).json({info: 'No hay reservas activas.'});
                }else{
                    return res.status(200).json({
                        msg: '',
                        data: result,
                        info: ''
                    });
                }
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

module.exports = { obtenerReservas };