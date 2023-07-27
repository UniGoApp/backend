const con = require("../../config/database");

const getCampus = async (req, res) => {
    con.execute('SELECT * FROM campus;', (err, result) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: '',
            data: result
        });
    });
};

const postCampus = async (req, res) => {
    con.execute('INSERT INTO campus (name, university, region, icon) VALUES (?,?,?,?);', [req.body.name, req.body.university, req.body.region, req.body.icon], (err, result) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: '',
            data: 'Campus publicado con éxito.'
        });
    });
};

const updateCampus = async (req, res) => {
    con.execute('UPDATE campus SET name=?, university=?, region=?, icon=? WHERE id=?;',[req.body.name, req.body.university, req.body.region, req.body.icon, req.params.id] , (err, result) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: '',
            data: 'Campus actualizado con éxito.'
        });
    });
};
const deleteCampus = async (req, res) => {
    con.execute('DELETE FROM campus WHERE id=?;', [req.params.id], (err, result) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: '',
            data: 'Campus borrado con éxito.'
        });
    });
};

module.exports = { getCampus, postCampus, updateCampus, deleteCampus };