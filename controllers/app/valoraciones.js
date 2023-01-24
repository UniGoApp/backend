const con = require("../database");

const obtenerValoraciones = async (req, res) => {
    console.log('req.params :>> ', req.user);
    con.execute(
        'SELECT * FROM valoraciones WHERE from_user = ? OR to_user = ?;', [req.user._id, req.user._id], (err, result) => {
            if (err) console.log(err);
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

module.exports = { obtenerValoraciones };