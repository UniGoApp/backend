const con = require("../database");
const idMaker = require('../../helpers/idMaker');

const obtenerViajes = async (req, res) => {
    const user_id = req.auth._id;
    con.execute('SELECT * FROM viajes WHERE status="ACTIVO" AND id_user!=? AND departure>CURRENT_DATE ORDER BY departure LIMIT 10;', [user_id], (err, result) => {
        if (err) return res.status(200).json({
            error: true,
            data: '',
            info: 'Parece que algo ha ido mal...'
        });
        if(result.length === 0) return res.status(200).json({
            info: 'No hay viajes disponibles.',
            data: '',
            error: true
        });
        return res.status(200).json({
            error: false,
            data: result,
            info: ''
        });
    });
};

const misViajes = async (req, res) => {
    con.execute('SELECT * FROM viajes WHERE id_user=? ORDER BY departure;', [req.auth._id], (err, result) => {
        if (err) return res.status(200).json({
            error: true,
            data: '',
            info: 'Parece que algo ha ido mal...'
        });
        if(result.length === 0) return res.status(200).json({
            info: 'No tienes ningún viaje publicado.',
            data: '',
            error: true
        });
        return res.status(200).json({
            error: false,
            data: result,
            info: ''
        });
    });
};

const publicarViaje = async (req, res) => {
    const id = idMaker('t');
    con.execute('INSERT INTO viajes (`id`,`id_user`,`origin`,`id_campus`,`price`,`seats`,`departure`,`comments`) VALUES (?,?,?,?,?,?,?,?);', [id,req.auth._id, req.body.origen, req.body.id_campus, req.body.precio, req.body.plazas, req.body.salida, req.body.observaciones], (err, result) => {
        if (err) return res.status(200).json({
            error: true,
            data: '',
            info: 'Parece que algo ha ido mal...'
        });
        return res.status(200).json({
            error: false,
            data: 'Viaje creado con éxito.',
            info: ''
        });
    });
};

const modificarViaje = async (req, res) => {
    con.execute('UPDATE viajes SET comments=? WHERE id=? AND id_user=?;', [req.body.observaciones, req.params.id, req.auth._id], (err, result) => {
        if (err) return res.status(200).json({
            error: true,
            data: '',
            info: 'Parece que algo ha ido mal...'
        });
        return res.status(200).json({
            error: false,
            data: 'Viaje modificado con éxito.',
            info: ''
        });
    });
};

const borrarViaje = async (req, res) => {
    con.execute('DELETE FROM viajes WHERE id=? AND id_user=?;', [req.body.viaje_id, req.auth._id], (err, result) => {
        if (err) return res.status(200).json({
            error: true,
            data: '',
            info: 'Parece que algo ha ido mal...'
        });
        return res.status(200).json({
            error: false,
            data: 'Viaje borrado con éxito.',
            info: ''
        });
    });
};

module.exports = { obtenerViajes, misViajes, publicarViaje, modificarViaje, borrarViaje };