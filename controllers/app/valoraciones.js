const { RolesAnywhere } = require("aws-sdk");
const con = require("../database");

const obtenerValoraciones = async (req, res) => {
    const user_id = req.user._id;
    con.execute(
        'SELECT v.*, u.id, u.username, u.picture, u.email_confirmed FROM valoraciones AS v INNER JOIN usuarios AS u ON v.from_user=u.id OR v.to_user=u.id WHERE from_user = ? OR to_user = ?;', [user_id, user_id], (err, result) => {
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