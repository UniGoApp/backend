const con = require("../database");
const { idMaker } = require('../../helpers/idMaker');
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_S3_accessKeyId,
  secretAccessKey: process.env.AWS_S3_secretAccessKey,
  region: process.env.AWS_REGION
});
const ses = new AWS.SES({apiVersion: '2010-12-01'});

const comprobarReserva = async (req, res) => {
    const user_id = req.auth._id;
    const trip_id = req.body.id_trip;
    con.execute("SELECT id, num_seats FROM reservas WHERE id_user=? AND id_trip=?;", [user_id, trip_id], (err, result) => {
            if (err) return res.status(200).json({error: true, info: 'Error inesperado en la base de datos.', data:''});
            if(result.length === 0) {
                return res.status(200).json({error: true, info: 'No existe ninguna reserva registrada para este viaje.', data:''});
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

const obtenerReserva = async (req, res) => {
    const user_id = req.auth._id;
    const reserva_id = req.params.id;
    con.execute("SELECT r.id AS id_reserva, r.id_trip, r.id_user AS pasajero, r.num_seats, v.origin, v.destination, v.price, v.seats AS total_seats, DATE_FORMAT(v.departure_date,'%Y-%m-%d') AS date, v.departure_time AS time, v.comments, c.name AS campus, c.university, c.region, c.icon FROM reservas AS r LEFT JOIN viajes AS v ON r.id_trip=v.id LEFT JOIN campus AS c ON c.id=v.destination WHERE r.id_user=? AND r.id=?;", [user_id,reserva_id], (err, result) => {
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

const obtenerReservas = async (req, res) => {
    con.execute("SELECT r.*, v.destination, DATE_FORMAT(v.departure_date,'%Y-%m-%d') AS date, v.departure_time AS time, c.name AS campus, c.university, c.icon FROM reservas AS r LEFT JOIN viajes AS v ON r.id_trip=v.id LEFT JOIN campus AS c ON v.destination=c.id WHERE r.id_user=? AND v.departure_date >= CURDATE();", [req.auth._id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(200).json({error: true, info: 'Error inesperado en la base de datos.', data:''});
            }
            if(result.length === 0) {
                return res.status(200).json({error:true, info: 'No hay reservas registradas.', data:''});
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

const publicarReserva = async (req, res) => {
    const id_res = idMaker('b');
    const id_user = req.auth._id;
    const {id_trip, num_seats, username, email, date, time, origin, campus, price} = req.body;
    con.execute('INSERT INTO reservas (id, id_trip, id_user, num_seats) VALUES (?,?,?,?);', [id_res, id_trip, id_user, num_seats], (err, result) => {
        if (err) return res.status(200).json({
            error: true,
            data: '',
            info: 'No se ha podido completar la reserva.'
        });
        //Send email with confirmation
        const params = {
            Source: "no-reply@unigoapp.es",
            Destination: {
                ToAddresses: [ email ]
            },
            ReplyToAddresses: [ "contacto@unigoapp.es" ],
            Template: 'ConfirmacionReserva',
            TemplateData: "{ \"id_reserva\":\""+ id_res +"\", \"username\":\""+ username +"\", \"date\":\""+ date +"\", \"time\":\""+ time +"\", \"origin\":\""+ origin +"\", \"campus\":\""+ campus +"\", \"num_seats\":\""+ num_seats +"\", \"price\":\""+ price +"\" }"
        };
        ses.sendTemplatedEmail(params, function(err, data) {
            if (err) {
                return res.status(200).json({error: true, info: 'Fallo al enviar el email.', data: ''});
            } else {
                return res.status(200).json({
                    error: false,
                    data: '',
                    info: 'Reserva confirmada con éxito.'
                });
            }
        });
        
    });
};

const borrarReserva = async (req, res) => {
    con.execute('DELETE FROM reservas WHERE id=? AND id_user=?;', [req.params.id,req.auth._id], (err, result) => {
        if (err) return res.status(200).json({
            error: true,
            info: 'No se ha podido borrar la reserva.',
            data:''
        });
        return res.status(200).json({
            error: false,
            info: '',
            data: 'Reserva cancelada con éxito.'
        });
    });
};

module.exports = { comprobarReserva, obtenerReserva, obtenerReservas, publicarReserva, borrarReserva };