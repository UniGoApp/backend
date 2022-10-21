const fs = require('fs');
const path = require('path');

const jsonDir = path.join(__dirname, "../../public/public_data/destinos.json");

const getDestinosWeb = async (req, res) => {
    fs.readFile(jsonDir, "utf8", (err, data) => {
        if (err) {
            return res.status(200).json({
                error: true,
                info: 'Se ha producido un error al leer el archivo.',
                data: ''
            });
        }
        try {
            const jsonData = JSON.parse(data);
            return res.status(200).json({
                error: false,
                    info: '',
                    data: jsonData
            });
        } catch (err) {
            return res.status(200).json({
                error: false,
                info: '',
                data: data
            });
        }
    });
};

const updateDestinos = async (req, res) => {
    if( req.user._rol === "ADMIN" || req.user._rol === "SUPER_ADMIN"){
        let newContent = req.body;
        if(!newContent) return;
        
        fs.writeFile(jsonDir, JSON.stringify(newContent, null, 2), (error) => {
            if (error) {
                return res.status(200).json({
                    error: true,
                    info: 'Error al escribir en el archivo.',
                    data: ''
                });
            }
            return res.status(200).json({
                error: false,
                info: 'Archivo modificado correctamente.',
                data: ''
            });
        });
    }else{
        return res.status(403).json({
            error: true,
            info: 'Acceso no autorizado',
            data: ''
        });
    }
};

module.exports = { getDestinosWeb, updateDestinos };