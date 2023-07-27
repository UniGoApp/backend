const { idMaker } = require("../../utils/idMaker");
const con = require("../../config/database");

const getReports = async (req, res) => {
    con.execute('SELECT * FROM reportes ORDER BY fecha;', (err, result) => {
        if (err) throw new Error('InternalServerError');
        if(result.length === 0) return res.status(200).json({
            error: true,
            info: 'No hay incidencias registradas.',
            data: ''
        });
        return res.status(200).json({
            error: false,
            info: '',
            data: result
        });
    });
};

const postReports = async (req, res) => {
    const id_report = idMaker('x');
    con.execute('INSERT INTO reportes (id, from_user, to_user, motivo, info) VALUES (?,?,?,?,?);', [id_report, req.auth._id, req.body.to_user, req.body.motivo, req.body.info] , (err, result) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: '',
            data: 'Denuncia publicada con éxito.'
        });
    });
};

const putReports = async (req, res) => {
    con.execute('UPDATE reportes SET from_user=?, to_user=?, motivo=?, info=? WHERE id=?;', [req.body.from_user, req.body.to_user, req.body.motivo, req.body.info, req.params.id], (err, result) => {
        if(err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: 'Viaje moficado con éxito.',
            data: ''
        });
    });
};

const deleteReports = async (req, res) => {
    con.execute('DELETE FROM reportes WHERE id=?;', [req.params.id], (err, result) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: '',
            data: 'Denuncia borrada con éxito.'
        });
    });
};

module.exports = { getReports, postReports, putReports, deleteReports };