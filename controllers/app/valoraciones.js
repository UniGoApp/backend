const con = require("../database");

const obtenerValoraciones = async (req, res) => {
    con.execute(
        'SELECT * FROM valoraciones WHERE from_user = ? OR to_user = ?;', [req.user._id, req.user._id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(200).json({error: true, info: 'Error inesperado en la base de datos.', data:''});
            }
            if(result.length === 0) {
                return res.status(200).json({error: true, info: 'No hay reservas registradas.', data:''});
            }else{
                return res.status(200).json({
                    error: false,
                    data: result,
                    info: ''
                });
            }
        }
    );
};

module.exports = { obtenerValoraciones };