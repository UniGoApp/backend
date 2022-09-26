const con = require("../../database");

const getComunidades = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'SELECT * FROM `comunidades`;', (err, result) => {
                if (err) throw err;
                if(result.length === 0) return res.status(200).json({
                    msg: 'No hay comunidades registradas.',
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

const postComunidades = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'INSERT INTO `comunidades` (`nombre`) VALUES (?);', [req.body.nombre], (err, result) => {
                if (err) throw err;
                con.execute(
                    'SELECT * FROM `comunidades` WHERE id = ?;', [result.insertId], (err, result2) => {
                        if (err) throw err;
                        if(result2.length === 0) return res.status(200).json({
                            msg: 'No se encuentra la comunidad con id: ' + result.insertId + '.',
                            data: '',
                            info: ''
                        });
                        return res.status(200).json({
                            msg: '',
                            data: result2,
                            info: 'Comunidad creada con éxito.'
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

const putComunidades = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'UPDATE `comunidades` SET `nombre` = ? WHERE id = ?;', [req.body.nombre, req.body.id], (err, result) => {
                if (err) throw err;
                con.execute(
                    'SELECT * FROM `comunidades` WHERE id = ?;', [req.body.id], (err, result2) => {
                        if (err) throw err;
                        if(result2.length === 0) return res.status(200).json({
                            msg: 'No se encuentra la comunidad con id: ' + req.body.id + '.',
                            data: '',
                            info: ''
                        });
                        return res.status(200).json({
                            msg: '',
                            data: result2,
                            info: 'Comunidad modificada con éxito.'
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

const deleteComunidades = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'DELETE FROM `comunidades` WHERE `id` = ?;', [req.body.id], (err, result) => {
                if (err) throw err;
                return res.status(200).json({
                    msg: '',
                    data: result,
                    info: 'Comunidad borrada con éxito.'
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

module.exports = { getComunidades, postComunidades, putComunidades, deleteComunidades };