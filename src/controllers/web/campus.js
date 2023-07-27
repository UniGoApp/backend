const con = require("../../config/database");

const getUniversidades = async (req, res) => {
    con.execute('SELECT DISTINCT university, icon, region, COUNT(university) as numCampus FROM campus GROUP BY university;', (err, result) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: '',
            data: result
        });
    });
};

module.exports = { getUniversidades };