const con = require("../../config/database");
const path = require('path');

const confirmEmail = async (req, res) => {
    const email = req.params.email;
    con.execute('SELECT id FROM usuarios WHERE email=?;', [email], (err, result) => { 
        if(err) throw new Error('InternalServerError');
        if(result.length === 0) return res.status(200).sendFile(path.join(__dirname,'../../templates/messages/error.html'));
        con.execute('UPDATE usuarios SET email_confirmed="1" WHERE email=?;', [email], (err, result) => {
            if (err) throw new Error('InternalServerError');
            return res.status(200).sendFile(path.join(__dirname,'../../templates/messages/success.html'));
        });
    });
};

module.exports = { confirmEmail };