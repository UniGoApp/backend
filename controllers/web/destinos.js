const fs = require('fs');
const path = require('path');

const jsonDir = path.join(__dirname, "../../public/public_data/destinos.json");

const getDestinosWeb = async (req, res) => {
    fs.readFile(jsonDir, "utf8", (err, data) => {
        if (err) {
            // console.log("Error reading file from disk:", err);
            return res.status(200).json({
                msg: 'Se ha producido un error al leer el archivo.',
                data: '',
                info: ''
            });
        }
        try {
            const jsonData = JSON.parse(data);
            // console.log('emails: ', jsonData);
            return res.status(200).json({
                msg: '',
                data: jsonData,
                info: ''
            });
        } catch (err) {
            // console.log("Error parsing JSON string:", err);
            return res.status(200).json({
                msg: '',
                data: data,
                info: ''
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
                    error: 'error',
                    info: 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde... Si el error persiste contacta con nosotros a soporte@unigoapp.es.'
                });
            }
            return res.status(200).json({
                error: '',
                info: 'Archivo modificado correctamente.'
            });
        });
    }else{
        return res.status(403).json({
            msg: 'Acceso no autorizado',
            data: '',
            info: ''
        });
    }
};

module.exports = { getDestinosWeb, updateDestinos };