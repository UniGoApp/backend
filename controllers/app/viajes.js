const con = require("../database");
const {idMaker} = require('../../helpers/idMaker');

const topViajes = async (req, res) => {
    const user_id = req.auth._id;
    con.execute("SELECT v.id, v.origin, v.price, DATE_FORMAT(v.departure_date,'%Y-%m-%d') AS date, v.departure_time AS time, v.status, v.visualizaciones, c.name, c.icon FROM viajes v LEFT JOIN campus c ON v.destination=c.id WHERE v.id_user!=? AND v.departure_date > CURRENT_DATE() ORDER BY v.visualizaciones DESC LIMIT 3;", [user_id], (err, result) => {
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

const obtenerViajesDia = async (req, res) => {
    const user_id = req.auth._id;
    const date = req.body.fecha.split('T')[0] || 'CURRENT_DATE()';
    const destination = req.body.destination || '';
    const university = req.body.university || -1;
    if(university !== -1 && destination !== '' ){
        con.execute("SELECT v.id, v.origin, v.price, DATE_FORMAT(v.departure_date,'%Y-%m-%d') AS date, v.departure_time AS time, v.status, v.visualizaciones, c.name, c.icon FROM viajes v LEFT JOIN campus c ON v.destination=c.id WHERE v.id_user!=? AND c.id=? AND v.departure_date=? ORDER BY date ASC LIMIT 8;", [user_id, destination, date], (err, result) => {
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
    }else if(university !== -1 && destination === '' ){
        con.execute("SELECT v.id, v.origin, v.price, DATE_FORMAT(v.departure_date,'%Y-%m-%d') AS date, v.departure_time AS time, v.status, v.visualizaciones, c.name, c.icon FROM viajes v LEFT JOIN campus c ON v.destination=c.id WHERE v.id_user!=? AND c.university=? AND v.departure_date=? ORDER BY date ASC LIMIT 8;", [user_id, university, date], (err, result) => {
            if (err) {return res.status(200).json({
                error: true,
                data: '',
                info: 'Parece que algo ha ido mal...'
            });}
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
    }else{
        con.execute("SELECT v.id, v.origin, v.price, DATE_FORMAT(v.departure_date,'%Y-%m-%d') AS date, v.departure_time AS time, v.status, v.visualizaciones, c.name, c.icon FROM viajes v LEFT JOIN campus c ON v.destination=c.id WHERE v.id_user!=? AND v.departure_date=? ORDER BY date ASC LIMIT 8;", [user_id, date], (err, result) => {
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
    }
};

const obtenerViajesGeneral = async (req, res) => {
    const user_id = req.auth._id;
    const sql = "SELECT DATE_FORMAT(v.departure_date,'%Y-%m-%d') AS date, JSON_ARRAYAGG(JSON_OBJECT('date', v.departure_date, 'time', v.departure_time, 'status', v.status, 'id', v.id, 'origin', v.origin, 'price', v.price, 'name', c.name, 'icon', c.icon)) AS viajes FROM viajes v LEFT JOIN campus c ON v.destination=c.id WHERE v.id_user!=? AND v.departure_date >= CURRENT_DATE() GROUP BY date ORDER BY date ASC LIMIT 8;";
    con.execute(sql, [user_id], (err, result) => {
        if (err) {
            return res.status(200).json({
            error: true,
            data: '',
            info: 'Parece que algo ha ido mal...'
        });}
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
    con.execute(`SELECT v.*, DATE_FORMAT(v.departure_date,'%Y-%m-%d') AS departure_date, u.username, u.picture AS user_image, u.email_confirmed, c.name, c.university, c.region, c.icon, c.banner,
    COALESCE(bookings.bookings_count, 0) AS bookings,
    COALESCE(ratings.average_score, 0) AS ratings
    FROM viajes v
    LEFT JOIN usuarios u ON v.id_user = u.id
    LEFT JOIN campus c ON v.destination = c.id
    LEFT JOIN ( SELECT id_trip, SUM(num_seats) AS bookings_count FROM reservas GROUP BY id_trip ) AS bookings ON v.id = bookings.id_trip
    LEFT JOIN ( SELECT to_user, ROUND(AVG(score), 1) AS average_score FROM valoraciones GROUP BY to_user ) AS ratings ON v.id_user = ratings.to_user
    WHERE v.id = ?;`, [req.params.id], (err, result) => {
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
        con.execute('SELECT * FROM reservas WHERE id_trip=?;', [req.params.id], (err2, result2) => {
            if (err2 || result2.length === 0) return res.status(200).json({
                error: false,
                data: {...result[0], bookings_arr: []},
                info: ''
            });
            return res.status(200).json({
                error: false,
                data: {...result[0], bookings_arr: result2},
                info: ''
            });
        });
    });
};

const misViajes = async (req, res) => {
    con.execute("SELECT v.id, v.origin, v.price, v.seats, DATE_FORMAT(v.departure_date,'%Y-%m-%d') AS date, v.departure_time AS time, v.status, v.visualizaciones, c.name, c.university, c.icon, SUM(r.num_seats) AS reservas FROM viajes v LEFT JOIN campus c ON v.destination=c.id LEFT JOIN reservas r ON v.id=r.id_trip WHERE v.id_user=? GROUP BY v.id ORDER BY date DESC;", [req.auth._id], (err, result) => {
        if (err) return res.status(200).json({
            error: true,
            data: '',
            info: 'Parece que algo ha ido mal...'
        });
        if(result.length === 0 || !result[0].id) {
            return res.status(200).json({
                error: true,
                data: '',
                info: 'No tienes ningún viaje publicado.'
            });
        }else{
            return res.status(200).json({
                error: false,
                data: result,
                info: ''
            });
        }
    });
};

const publicarViaje = async (req, res) => {
    const id = idMaker('t');
    con.execute('INSERT INTO viajes (id, id_user, origin, destination, price, seats, departure_date, departure_time, comments) VALUES (?,?,?,?,?,?,?,?,?);', [id,req.auth._id, req.body.origin, req.body.destination, req.body.price, req.body.seats, req.body.date, req.body.time, req.body.comments], (err, result) => {
        if (err) return res.status(200).json({
            error: true,
            data: '',
            info: 'No se ha podido procesar la petición, por favor disculpe las molestias...r'
        });
        return res.status(200).json({
            error: false,
            data: '',
            info: 'Viaje creado con éxito.'
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
    con.execute('DELETE FROM viajes WHERE id=? AND id_user=?;', [req.params.id, req.auth._id], (err, result) => {
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

module.exports = { topViajes, obtenerViajesDia, obtenerViajesGeneral, detallesViaje, misViajes, publicarViaje, modificarViaje, borrarViaje };