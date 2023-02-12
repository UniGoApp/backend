const con = require("../database");
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_S3_accessKeyId,
  secretAccessKey: process.env.AWS_S3_secretAccessKey,
  region: process.env.AWS_REGION
});
const ses = new AWS.SES({apiVersion: '2010-12-01'});

const obtenerReserva = async (req, res) => {
    const user_id = req.auth._id;
    const reserva_id = req.params.id;
    con.execute(
        'SELECT r.id AS id_reserva, r.id_trip, r.id_user AS pasajero, r.num_seats, v.origin, v.id_campus, v.price, v.seats AS total_seats, v.departure, v.comments, c.name AS campus, c.university, c.region, c.icon FROM reservas AS r INNER JOIN viajes AS v ON r.id_trip=v.id INNER JOIN campus AS c ON c.id=v.id_campus WHERE r.id_user=? AND r.id=?;', [user_id,reserva_id], (err, result) => {
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
    const user_id = req.auth._id;
    con.execute(
        'SELECT r.*, v.id_campus, v.departure, c.name AS campus, c.university, c.icon FROM reservas AS r INNER JOIN viajes AS v ON r.id_trip=v.id INNER JOIN campus AS c ON v.id_campus=c.id WHERE r.id_user=?;', [user_id], (err, result) => {
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
    con.execute('INSERT INTO reservas (id, id_trip, id_user, num_seats) VALUES (?,?,?,?);', [id_res, req.body.id_trip, req.auth._id, req.body.num_seats], (err, result) => {
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
            Template: 'NuevaReserva',
            TemplateData: "{ \"email\":\""+ email +"\" }"
        };
        ses.sendTemplatedEmail(params, function(err, data) {
            if (err) {
                console.log('Error >> ', err.stack);
                return res.status(200).json({error: true, info: 'Fallo al enviar el email.', data: ''});
            } else {
                console.log(data);
            }
        });
        return res.status(200).json({
            error: false,
            data: 'Reserva confirmada con éxito.',
            info: ''
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

module.exports = { obtenerReserva, obtenerReservas, publicarReserva, borrarReserva };