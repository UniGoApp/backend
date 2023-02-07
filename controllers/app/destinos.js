const fs = require('fs');
const path = require('path');

const jsonDir = path.join(__dirname, '../../data/destinos.json');

const obtenerDestinos = async (req, res) => {
    try {
        fs.readFile(jsonDir, "utf8", (err, data) => {
            if (err) {
                return res.status(200).json({
                    error: true,
                    info: 'Se ha producido un error al leer el archivo.',
                    data: ''
                });
            }
            const jsonData = JSON.parse(data);
            return res.status(200).json({
                error: false,
                info: '',
                data: jsonData
            });
        });
    } catch (err) {
        return res.status(200).json({
            error: true,
            info: err,
            data: data
        });
    }
};

module.exports = { obtenerDestinos };