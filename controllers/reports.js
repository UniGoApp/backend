const { idMaker } = require("../helpers/idMaker");
const con = require("./database");

const getReports = async (req, res) => {
    if(req.auth._rol === "ADMIN" || req.auth._rol === "SUPER_ADMIN") {
        con.execute(`SELECT * FROM reports ORDER BY fecha;`, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(200).json({
                    error: true,
                    info: 'Error con la base de datos.',
                    data:''
                });
            }
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
    con.execute(`INSERT INTO reports (id, id_user_reporting, id_user_reported, motivo, info) VALUES (?,?,?,?,?);`,[id_report,req.auth._id, req.body.id_user_reported, req.body.motivo, req.body.info] , (err, result) => {
        if (err) {
            console.log(err);
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
        con.execute(`DELETE FROM reports WHERE id=?;`,[req.params.id] , (err, result) => {
            if (err) {
                console.log(err);
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