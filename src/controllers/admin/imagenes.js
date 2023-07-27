const con = require("../../config/database");

const getUnisImg = async (req, res) => {
    con.execute('SELECT DISTINCT icon FROM campus;', (err, result) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: '',
            data: result
        });
    });
};

const getUsersImg = async (req, res) => {
    con.execute('SELECT id, picture FROM usuarios;', (err, result) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: '',
            data: result
        });
    });
};

module.exports = { getUnisImg, getUsersImg };