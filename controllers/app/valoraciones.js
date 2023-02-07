const con = require("../database");

const obtenerValoraciones = async (req, res) => {
    const user_id = req.auth._id;
    con.execute(
        `SELECT v.*, from_user.username AS from_user_username, from_user.picture AS from_user_picture, from_user.email_confirmed AS from_user_email_confirmed, to_user.username AS to_user_username, to_user.picture AS to_user_picture, to_user.email_confirmed AS to_user_email_confirmed
        FROM valoraciones AS v
        INNER JOIN usuarios AS from_user ON v.from_user = from_user.id
        INNER JOIN usuarios AS to_user ON v.to_user = to_user.id
        WHERE v.from_user=? OR v.to_user=?;`, [user_id,user_id], (err, result) => {
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
////Original
// const obtenerValoraciones = async (req, res) => {
//     const user_id = req.auth._id;
//     con.execute(
//         `SELECT v.*, u.id, u.username, u.picture, u.email_confirmed
//         FROM valoraciones AS v
//         INNER JOIN usuarios AS u ON v.from_user=u.id OR v.to_user=u.id WHERE u.id = ?;`, [user_id], (err, result) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(200).json({error: true, info: 'Error inesperado en la base de datos.', data:''});
//             }
//             if(result.length === 0) {
//                 return res.status(200).json({error: true, info: 'No hay reservas registradas.', data:''});
//             }else{
//                 return res.status(200).json({
//                     error: false,
//                     info: '',
//                     data: result
//                 });
//             }
//         }
//     );
// };

module.exports = { obtenerValoraciones };