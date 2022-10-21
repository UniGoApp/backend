const con = require("../database");

const getMensajes = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'SELECT * FROM mensajes;', (err, result) => {
                if (err) console.log('err', err);
                if(result.length === 0) return res.status(200).json({
                    error: true,
                    info: 'No hay mensajes registrados.',
                    data: ''
                });
                return res.status(200).json({
                    error: false,
                    info: '',
                    data: result
                });
            }
        );
    }else{
        return res.status(403).json({
            error: true,
            info: 'Acceso no autorizado',
            data: ''
        });
    }
};

const postMensajes = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'INSERT INTO mensajes (`asunto`, `mensaje`) VALUES (?, ?);', [req.body.asunto, req.body.mensaje], (err, result) => {
                if (err) console.log('err', err);
                con.execute(
                    'SELECT * FROM mensajes WHERE id = ?;', [result.insertId], (err, result2) => {
                        if (err) console.log('err', err);
                        if(result2.length === 0) return res.status(200).json({
                            error: true,
                            info: 'No se encuentra el mensaje con id: ' + result.insertId + '.',
                            data: ''
                        });
                        return res.status(200).json({
                            error: false,
                            info: 'Mensaje enviado con éxito.',
                            data: result2
                        });
                    }
                );
            }
        );
    }else{
        return res.status(403).json({
            error: true,
            info: 'Acceso no autorizado',
            data: ''
        });
    }
};

const deleteMensajes = async (req, res) => {
    if(req.user._rol === "SUPER_ADMIN" || req.user._rol === "ADMIN"){
        con.execute(
            'DELETE FROM mensajes WHERE id = ?;', [req.body.id], (err, result) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        info: 'Mensaje no se ha podido borrar. Por favor vuelva a intentarlo mas tarde o contacte con contaco@unigoapp.es.',
                        data: ''
                    });
                }
                return res.status(200).json({
                    error: false,
                    info: 'Mensaje borrado con éxito.',
                    data: result
                });
            }
        );
    }else{
        return res.status(403).json({
            error: true,
            info: 'Acceso no autorizado',
            data: ''
        });
    }
};

module.exports = { getMensajes, postMensajes, deleteMensajes };