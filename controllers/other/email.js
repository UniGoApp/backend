const con = require("../database");
const path = require('path');

const confirmEmail = async (req, res) => {
    const email = req.params.email;
    con.execute('SELECT id FROM `usuarios` WHERE `email` = ?;', [email], (err, result) => { 
        if(err || result.length === 0) {
            return res.status(200).sendFile(path.join(__dirname,'../../templates/messages/error.html'));
        }else{
            con.execute('UPDATE `usuarios` SET `email_confirmed` = ? WHERE `email` = ?;', ['1', email], (err, result) => {
                if (err) {
                    return res.status(200).sendFile(path.join(__dirname,'../../templates/messages/error.html'));
                }else{
                    return res.status(200).sendFile(path.join(__dirname,'../../templates/messages/success.html'));
                }
            });
        }
    });
};

module.exports = { confirmEmail };