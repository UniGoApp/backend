const con = require("../../database");
const jwt = require("jsonwebtoken");

const getCampus = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'SELECT * FROM `campus`;', (err, result) => {
                if (err) throw err;
                if(result.length === 0) return res.status(200).json({
                    msg: 'No hay campus registrados.',
                    data: '',
                    info: ''
                });
                return res.status(200).json({
                    msg: '',
                    data: result,
                    info: ''
                });
            }
        );
    }else{
        return res.status(403).json({
            msg: 'Acceso no autorizado',
            data: '',
            info: ''
        });
    }
};

const postCampus = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'INSERT INTO `campus` (`id_universidad`,`nombre`) VALUES (?, ?);', [req.body.id_universidad, req.body.nombre], (err, result) => {
                if (err) throw err;
                con.execute(
                    'SELECT * FROM `campus` WHERE id = ?;', [result.insertId], (err, result2) => {
                        if (err) throw err;
                        if(result2.length === 0) return res.status(200).json({
                            msg: 'No se encuentra el campus con id: ' + result.insertId + '.',
                            data: '',
                            info: ''
                        });
                        return res.status(200).json({
                            msg: '',
                            data: result2,
                            info: 'Campus creado con éxito.'
                        });
                    }
                );
            }
        );
    }else{
        return res.status(403).json({
            msg: 'Acceso no autorizado',
            data: '',
            info: ''
        });
    }
};

const putCampus = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'UPDATE `campus` SET `id_universidad` = ?,`nombre` = ? WHERE id = ?;', [req.body.id_universidad, req.body.nombre, req.body.id], (err, result) => {
                if (err) throw err;
                con.execute(
                    'SELECT * FROM `campus` WHERE id = ?;', [req.body.id], (err, result2) => {
                        if (err) throw err;
                        if(result2.length === 0) return res.status(200).json({
                            msg: 'No se encuentra el campus con id: ' + req.body.id + '.',
                            data: '',
                            info: ''
                        });
                        return res.status(200).json({
                            msg: '',
                            data: result2,
                            info: 'Campus modificado con éxito.'
                        });
                    }
                );
            }
        );
    }else{
        return res.status(403).json({
            msg: 'Acceso no autorizado',
            data: '',
            info: ''
        });
    }
};

const deleteCampus = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'DELETE FROM `campus` WHERE `id` = ?;', [req.body.id], (err, result) => {
                if (err) throw err;
                return res.status(200).json({
                    msg: '',
                    data: result,
                    info: 'Campus borrado con éxito.'
                });
            }
        );
    }else{
        return res.status(403).json({
            msg: 'Acceso no autorizado',
            data: '',
            info: ''
        });
    }
};

module.exports = { getCampus, postCampus, putCampus, deleteCampus };