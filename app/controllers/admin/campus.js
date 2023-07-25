const con = require("../database");

const getCampus = async (req, res) => {
    if(req.auth._rol === "ADMIN" || req.auth._rol === "SUPER_ADMIN") {
        con.execute('SELECT * FROM campus;', (err, result) => {
            if (err) {
                return res.status(200).json({
                    error: true,
                    info: 'No se ha podido obtener la información de la base de datos.',
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

const postCampus = async (req, res) => {
    if(req.auth._rol === "ADMIN" || req.auth._rol === "SUPER_ADMIN") {
        con.execute('INSERT INTO campus (name, university, region, icon) VALUES (?,?,?,?);',[req.body.name, req.body.university, req.body.region, req.body.icon] , (err, result) => {
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
                data: 'Campus publicado con éxito.'
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

const updateCampus = async (req, res) => {
    if(req.auth._rol === "ADMIN" || req.auth._rol === "SUPER_ADMIN") {
        con.execute('UPDATE campus SET name=?, university=?, region=?, icon=? WHERE id=?;',[req.body.name, req.body.university, req.body.region, req.body.icon, req.params.id] , (err, result) => {
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
                data: 'Campus actualizado con éxito.'
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
const deleteCampus = async (req, res) => {
    if(req.auth._rol === "ADMIN" || req.auth._rol === "SUPER_ADMIN") {
        con.execute('DELETE FROM campus WHERE id=?;', [req.params.id], (err, result) => {
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
                data: 'Campus borrado con éxito.'
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

module.exports = { getCampus, postCampus, updateCampus, deleteCampus };