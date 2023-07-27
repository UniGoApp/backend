const { idMaker } = require("../../utils/idMaker");
const con = require("../../config/database");

const postReports = async (req, res) => {
    const id_report = idMaker('x');
    con.execute(`INSERT INTO reportes (id, from_user, to_user, motivo, info) VALUES (?,?,?,?,?);`, [id_report, req.auth._id, req.body.to_user, req.body.motivo, req.body.info] , (err, result) => {
        if (err) {
            return res.status(200).json({
                error: true,
                info: 'Error con la base de datos.',
                data:''
            });
        }
        return res.status(200).json({
            error: false,
            info: '',
            data: 'Denuncia publicada con éxito.'
        });
    });
};

module.exports = { postReports };