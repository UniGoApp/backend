const fs = require('fs');
const path = require('path');

const jsonDir = path.join(__dirname, "../../data/newsletter.json");

const getNewsletter = async (req, res) => {
    fs.readFile(jsonDir, "utf8", (err, data) => {
        if(err) throw new Error('InternalServerError');
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

const updateNewsletter = async (req, res) => {
    let newContent = req.body;
    if(!newContent) return;
    
    fs.writeFile(jsonDir, JSON.stringify(newContent, null, 2), (err) => {
        if(err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: 'Archivo modificado correctamente.',
            data: ''
        });
    });
};

module.exports = { getNewsletter, updateNewsletter };