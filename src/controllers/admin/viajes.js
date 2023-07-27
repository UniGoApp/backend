const con = require("../../config/database");
const { idMaker } = require('../../utils/idMaker');

const getViajes = async (req, res) => {
    con.execute('SELECT * FROM viajes;', (err, result) => {
        if (err) throw new Error('InternalServerError');
        if(result.length === 0) return res.status(200).json({
            error: true,
            info: 'No hay viajes registrados.',
            data: ''
        });
        return res.status(200).json({
            error: false,
            info: '',
            data: result
        });
    });
};

const postViajes = async (req, res) => {
    let id = idMaker('t');
    con.execute('INSERT INTO viajes (`id`, `id_user`, `origin`,`destination`,`price`,`seats`,`departure`,`comments`,`status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);', [id, req.body.id_usuario, req.body.origen, req.body.destination, req.body.precio, req.body.plazas, req.body.salida, req.body.observaciones, req.body.estado], (err, result) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: 'Viaje creado con éxito.',
            data: ''
        });
    });
};

const putViajes = async (req, res) => {
    con.execute( 'UPDATE viajes SET comments=?, status=? WHERE id=?;', [req.body.comments, req.body.status, req.params.id], (err, result) => {
        if(err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: 'Viaje moficado con éxito.',
            data: ''
        });
    });
};

const deleteViajes = async (req, res) => {
    con.execute('DELETE FROM viajes WHERE id=?;', [req.params.id], (err, result) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: 'Viaje borrado con éxito.',
            data: ''
        });
    });
};

module.exports = { getViajes, postViajes, putViajes, deleteViajes };