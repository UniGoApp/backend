const con = require("../../database");
const nanoid = require('nanoid');
const fs = require('fs');
const path = require('path');

const upload_file = async (req, res) => {
    // console.log('upload_file > img > user id: ', req.user._id);
    const image_all = req.body.image;
    const image_data = image_all.split('data:image/jpg;base64,').pop();
    const image_name = nanoid();
    const image_type = '.jpg';
    const image_file = image_name.concat(image_type);

    const upload_path = path.resolve(__dirname, `../../../public/img/users/${image_file}`);
    // let writeFileStream = fs.createWriteStream(upload_path);
    // writeFileStream.write(image_data);
    // writeFileStream.end();

    fs.writeFile(upload_path, image_data, {encoding: 'base64'}, function(err) {
        if(err){
            return res.json({
                msg: 'Error inesperado.',
                data: '',
                info: ''
            });
        }
    });

    const server_path = `http://192.168.1.42:8000/file/${image_file}`; //https, nombre de dominio y sin el puerto
    //Update user picture name and route
    con.execute(
        'UPDATE `usuarios` SET `picture` = ? WHERE id = ?', [server_path, req.user._id], (err, result) => {
            if (err) {
                return res.json({
                    msg: 'Error inesperado.',
                    data: '',
                    info: ''
                });
            }
            return res.status(200).json({
                msg: '',
                data: server_path,
                info: 'Imagen actualizada con éxito.'
            });
        }
    );

};

const updateRrss = async (req, res) => {
    if(req.user._id == req.params.id){
        con.execute(
            'UPDATE `usuarios` SET `rrss` = ? WHERE id = ?', [req.body.value, req.user._id], (err, result) => {
                if (err) {
                    return res.json({
                        msg: 'Error inesperado.',
                        data: '',
                        info: ''
                    });
                }
                return res.status(200).json({
                    msg: '',
                    data: req.body.value,
                    info: 'Preferencias actualizadas con éxito.'
                });
            }
        );
    }
};

//ADMINS
const getFiles = async (req, res) => {
    
};

//USERS
const getFile = async (req, res) => {
    const path_name = path.resolve(__dirname, '../../../public/img/users');
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
            res.redirect('/404');
        }
    });
};

module.exports = { upload_file, getFiles, getFile, updateRrss };