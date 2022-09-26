const con = require("../../database");

const getUniversidades = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'SELECT * FROM `universidades`;', (err, result) => {
                if (err) throw err;
                if(result.length === 0) return res.status(200).json({
                    msg: 'No hay universidades registradas.',
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

const postUniversidades = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'INSERT INTO `universidades` (`id_comunidad`,`nombre`,`nombre_corto`) VALUES (?, ?, ?);', [req.body.id_comunidad, req.body.nombre, req.body.nombre_corto], (err, result) => {
                if (err) throw err;
                con.execute(
                    'SELECT * FROM `universidades` WHERE id = ?;', [result.insertId], (err, result2) => {
                        if (err) throw err;
                        if(result2.length === 0) return res.status(200).json({
                            msg: 'No se encuentra la universidad con id: ' + result.insertId + '.',
                            data: '',
                            info: ''
                        });
                        return res.status(200).json({
                            msg: '',
                            data: result2,
                            info: 'Universidad creada con éxito.'
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

const putUniversidades = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'UPDATE `universidades` SET `id_comunidad` = ?,`nombre` = ?,`nombre_corto` = ? WHERE id = ?;', [req.body.id_comunidad, req.body.nombre, req.body.nombre_corto, req.body.id], (err, result) => {
                if (err) throw err;
                con.execute(
                    'SELECT * FROM `universidades` WHERE id = ?;', [req.body.id], (err, result) => {
                        if (err) throw err;
                        if(result.length === 0) return res.status(200).json({
                            msg: 'No se encuentra la universidad con id: ' + req.body.id + '.',
                            data: '',
                            info: ''
                        });
                        return res.status(200).json({
                            msg: '',
                            data: result,
                            info: 'Universidad modificada con éxito.'
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

const deleteUniversidades = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'DELETE FROM `universidades` WHERE `id` = ?', [req.body.id], (err, result) => {
                if (err) throw err;
                return res.status(200).json({
                    msg: '',
                    data: result,
                    info: 'Universidad borrada con éxito.'
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

module.exports = { getUniversidades, postUniversidades, putUniversidades, deleteUniversidades };