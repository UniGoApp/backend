const con = require("../database");
const idMaker = require("../../helpers/idMaker");

const obtenerValoraciones = async (req, res) => {
    const user_id = req.auth._id;
    con.execute(
        `SELECT v.*, from_user.username AS from_user_username, from_user.picture AS from_user_picture, from_user.email_confirmed AS from_user_email_confirmed, to_user.username AS to_user_username, to_user.picture AS to_user_picture, to_user.email_confirmed AS to_user_email_confirmed
        FROM valoraciones AS v
        INNER JOIN usuarios AS from_user ON v.from_user = from_user.id
        INNER JOIN usuarios AS to_user ON v.to_user = to_user.id
        WHERE v.from_user=? OR v.to_user=?;`, [user_id, user_id], (err, result) => {
            if (err) return res.status(200).json({
                error: true,
                data: '',
                info: 'Parece que algo ha ido mal...'
            });
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

// Publicar valoracion
const publicarValoracion = async (req, res) => {
    const id_val = idMaker('r');
    con.execute('INSERT INTO valoraciones (id, id_trip, from_user, to_user, score, comment) VALUES (?,?,?,?,?,?);', [id_val, req.body.id_trip, req.auth._id, req.body.to_user, req.body.score, req.body.comment], (err, result) => {
        if (err) return res.status(200).json({
            error: true,
            data: '',
            info: 'Parece que algo ha ido mal...'
        });
        return res.status(200).json({
            error: false,
            data: 'Viaje valorado con éxito.',
            info: ''
        });
    });
};

const borrarValoracion = async (req, res) => {
    con.execute('DELETE FROM valoraciones WHERE id=? AND from_user=?;', [req.params.id,req.auth._id], (err, result) => {
        if (err) return res.status(200).json({
            error: true,
            data: '',
            info: 'Parece que algo ha ido mal...'
        });
        return res.status(200).json({
            error: false,
            data: 'Valoración borrada con éxito.',
            info: ''
        });
    });
};

module.exports = { obtenerValoraciones, publicarValoracion, borrarValoracion };