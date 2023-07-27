const con = require("../../config/database");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const path = require('path');

const getUsuarios = async (req, res) => {
    if(req.auth._rol === "SUPER_ADMIN"){
        con.execute('SELECT * FROM usuarios WHERE role <> "SUPER_ADMIN";', (err, result) => {
            if (err) throw new Error('InternalServerError');
            if(result.length === 0) return res.status(200).json({
                error: true,
                info: 'No hay usuarios registrados.',
                data: ''
            });
            return res.status(200).json({
                error: false,
                info: '',
                data: result
            });
        });
    }else{
        con.execute('SELECT * FROM usuarios WHERE role = "USER";', (err, result) => {
            if (err) throw new Error('InternalServerError');
            if(result.length === 0) return res.status(200).json({
                error: true,
                info: 'No hay usuarios registrados.',
                data: ''
            });
            return res.status(200).json({
                error: false,
                info: '',
                data: result
            });
        });
    }
};

const postUsuarios = async (req, res) => {
    con.execute('SELECT * FROM usuarios WHERE email=? OR phone=?;', [req.body.email, req.body.phone], (err, result) => {
        if (err) throw new Error('InternalServerError');
        if(result.length !== 0){
            return res.status(409).json({
                error: true,
                info: 'Email o teléfono en uso.',
                data: ''
            });
        } else {
            let dateTime = new Date().toJSON().split('T');
            let date = dateTime[0].replaceAll('-','');
            let time = dateTime[1].split('.')[0].replaceAll(':','');
            let id = `u_${date}_${time}`;
            const hashedPassword = bcrypt.hashSync(req.body.password, 10);
            con.execute('INSERT INTO usuarios (id,email,password,username,role,phone,rrss) VALUES (?, ?, ?, ?, ?, ?, ?);', [id, req.body.email, hashedPassword, req.body.username, req.body.role, req.body.phone, req.body.rrss], (err, result) => {
                if (err) throw new Error('InternalServerError');
                con.execute('SELECT * FROM usuarios WHERE id = ?;', [id], (err, result2) => {
                    if (err) throw new Error('InternalServerError');
                    return res.status(200).json({
                        error: false,
                        info: 'Usuario creado con éxito.',
                        data: result2
                    });
                });
            });
        }
    });
};

const putUsuarios = async (req, res) => {
    con.execute( 'UPDATE usuarios SET email=?, username=?, role=?, phone=?, picture=?, reset_code=?, creation_time=?, rrss=? WHERE id=?;', [req.body.email, req.body.username, req.body.role, req.body.phone, req.body.picture, req.body.reset_code, req.body.creation_time, req.body.rrss, req.params.id], (err, result) => {
            if (err) throw new Error('InternalServerError');
            return res.status(200).json({
                error: false,
                info: 'Usuario moficado con éxito.',
                data: ''
            });
        }
    );
};

const deleteUsuarios = async (req, res) => {
    con.execute('DELETE FROM usuarios WHERE id=?;', [req.params.id], (err, result) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: 'Usuario borrado con éxito.',
            data: ''
        });
    });
};

const borrarImagenUsuario = async (req, res) => {
    const previous_path = path.resolve(__dirname, `../../public/img/users/${req.body.old_image}`);
    fs.rm(previous_path, {force: true}, (err) => {
        throw new Error('InternalServerError');
    });
    con.execute('UPDATE usuarios SET picture=? WHERE id=?;', ['user_default.png', req.params.id], (err, result) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: 'Imagen actualizada con éxito.',
            data: ''
        });
    });
};

module.exports = { getUsuarios, postUsuarios, putUsuarios, deleteUsuarios, borrarImagenUsuario };