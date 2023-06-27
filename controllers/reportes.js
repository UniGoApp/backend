const { idMaker } = require("../helpers/idMaker");
const con = require("./database");

const getReports = async (req, res) => {
    if(req.auth._rol === "ADMIN" || req.auth._rol === "SUPER_ADMIN") {
        con.execute(`SELECT * FROM reportes ORDER BY fecha;`, (err, result) => {
            if (err) {
                return res.status(200).json({
                    error: true,
                    info: 'Error con la base de datos.',
                    data:''
                });
            }
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
    }else{
        return res.status(403).json({
            error: true,
            info: 'Acceso no autorizado',
            data: ''
        });
    }
};

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

const deleteReports = async (req, res) => {
    if(req.auth._rol === "ADMIN" || req.auth._rol === "SUPER_ADMIN") {
        con.execute(`DELETE FROM reportes WHERE id=?;`,[req.params.id] , (err, result) => {
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
                data: 'Denuncia borrada con éxito.'
            });
        });
    }else{
        return res.status(403).json({
            error: true,
            info: 'Acceso no autorizado',
            data: ''
        });
    }
};

module.exports = { getReports, postReports, deleteReports };