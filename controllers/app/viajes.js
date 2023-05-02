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

const detallesViaje = async (req, res) => {
    const user_id = req.auth._id;
    con.execute('SELECT v.*, u.username, u.picture AS user_image, c.name, c.university, c.region, c.icon, c.banner FROM viajes v LEFT JOIN usuarios u ON v.id_user=u.id LEFT JOIN campus c ON c.id=v.id_campus WHERE v.id=?;', [req.params.id], (err, result) => {
        if (err) return res.status(200).json({
            error: true,
            data: '',
            info: 'Parece que algo ha ido mal...'
        });
        if(result.length === 0) return res.status(200).json({
            info: 'Este viaje no existe.',
            data: '',
            error: true
        });
        let visitas = result[0].visualizaciones + 1;
        if(result[0].id_user != user_id){
            con.execute('UPDATE viajes SET visualizaciones=? WHERE id=?;', [visitas, req.params.id]);
        }
        return res.status(200).json({
            error: false,
            data: result[0],
            info: ''
        });
    });
};

const misViajes = async (req, res) => {
    con.execute('SELECT v.id, v.origin, v.price, v.seats, v.departure, v.status, v.visualizaciones, c.name, c.university, c.icon, SUM(r.num_seats) AS reservas FROM viajes v LEFT JOIN campus c ON c.id=v.id_campus LEFT JOIN reservas r ON r.id_trip=v.id WHERE v.id_user=? ORDER BY v.departure;', [req.auth._id], (err, result) => {
        if (err) return res.status(200).json({
            error: true,
            data: '',
            info: 'Parece que algo ha ido mal...'
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
    con.execute('INSERT INTO viajes (id,id_user,origin,id_campus,price,seats,departure,comments) VALUES (?,?,?,?,?,?,?,?);', [id,req.auth._id, req.body.origin, req.body.id_campus, req.body.price, req.body.seats, req.body.departure, req.body.comments], (err, result) => {
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

module.exports = { obtenerViajes, detallesViaje, misViajes, publicarViaje, modificarViaje, borrarViaje };