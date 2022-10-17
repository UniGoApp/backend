const con = require("../database");

const publicarMensaje = async (req, res) => {
    if(req.user._rol === "USER"){
        con.execute(
            'INSERT INTO `mensajes` (`asunto`, `mensaje`) VALUES (?, ?);', [req.body.asunto, req.body.mensaje], (err, result) => {
                if (err) throw err;
                return res.status(200).json({info: 'Mensaje enviado con éxito.'});
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

module.exports = { publicarMensaje };