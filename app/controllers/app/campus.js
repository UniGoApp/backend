const con = require("../database");

const obtenerCampus = async (req, res) => {
    con.execute(`SELECT * FROM campus ORDER BY university;`, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(200).json({
                error: true,
                info: 'Error con la base de datos.',
                data:''
            });
        }
        return res.status(200).json({
            error: false,
            info: '',
            data: result
        });
    });
};

module.exports = { obtenerCampus };