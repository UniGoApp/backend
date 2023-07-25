const con = require("../database");

const getUniversidades = async (req, res) => {
    con.execute('SELECT DISTINCT university, icon, region, COUNT(university) as numCampus FROM campus GROUP BY university;', (err, result) => {
        if (err) {
            return res.status(200).json({
                error: true,
                info: 'Estamos teniendo dificultades para mostrarte la información. Disculpa las molestias.',
                data: ''
            });
        }
        return res.status(200).json({
            error: false,
            info: '',
            data: result
        });
    });
};

module.exports = { getUniversidades };