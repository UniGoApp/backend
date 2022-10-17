const con = require("../../database");

const getMensajes = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'SELECT * FROM `mensajes`;', (err, result) => {
                if (err) console.log('err', err);
                if(result.length === 0) return res.status(200).json({
                    msg: 'No hay mensajes registrados.',
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

const postMensajes = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'INSERT INTO `mensajes` (`asunto`, `mensaje`) VALUES (?, ?);', [req.body.asunto, req.body.mensaje], (err, result) => {
                if (err) console.log('err', err);
                con.execute(
                    'SELECT * FROM `mensajes` WHERE id = ?;', [result.insertId], (err, result2) => {
                        if (err) console.log('err', err);
                        if(result2.length === 0) return res.status(200).json({
                            msg: 'No se encuentra el mensaje con id: ' + result.insertId + '.',
                            data: '',
                            info: ''
                        });
                        return res.status(200).json({
                            msg: '',
                            data: result2,
                            info: 'Mensaje enviado con éxito.'
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

const deleteMensajes = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'DELETE FROM `mensajes` WHERE `id` = ?;', [req.body.id], (err, result) => {
                if (err) console.log('err', err);
                return res.status(200).json({
                    msg: '',
                    data: result,
                    info: 'Mensaje borrado con éxito.'
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

module.exports = { getMensajes, postMensajes, deleteMensajes };