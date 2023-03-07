const con = require("../database");
const fs = require('fs');
const path = require('path');
const { idMaker } = require("../../helpers/idMaker");

const uploadPicture = async (req, res) => {
    const image_all = req.body.image;
    const image_data = image_all.split('data:image/jpg;base64,').pop();
    const image_file = `${idMaker('i')}.jpg`;

    const upload_path = path.resolve(__dirname, `../../public/img/users/${image_file}`);
    
    fs.writeFile(upload_path, image_data, {encoding: 'base64'}, function(err) {
        if(err){
            return res.json({
                info: 'Error inesperado.',
                data: '',
                error: true
            });
        }
    });

    con.execute(
        'UPDATE usuarios SET picture=? WHERE id=?', [image_file, req.auth._id], (err, result) => {
            if (err) {
                return res.json({
                    error: true,
                    info: 'No se ha podido actualizar la foto de perfil.',
                    data: ''
                });
            }
            return res.status(200).json({
                error: false,
                data: image_file,
                info: 'Imagen actualizada con éxito.'
            });
        }
    );
};

const getUserPic = async (req, res) => {
    const path_name = path.resolve(__dirname, '../../public/img/users');
    const options = {
        root: path_name,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    
    const fileName = req.params.name;
    res.sendFile(fileName, options, (err) => {
        if (err) {
            console.log('err :>> ', err);
        }
    });
};

const getUniPic = async (req, res) => {
    const path_name = path.resolve(__dirname, '../../public/img/universidades');
    const options = {
        root: path_name,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    
    const fileName = req.params.name;
    res.sendFile(fileName, options, (err) => {
        if (err) {
            console.log('err :>> ', err);
        }
    });
};

module.exports = { uploadPicture, getUserPic, getUniPic };