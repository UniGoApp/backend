const con = require("../database");
const fs = require('fs');
const path = require('path');
const bcrypt = require("bcryptjs");
const { idMaker } = require("../../helpers/idMaker");

const jsonDir = path.join(__dirname, "../../data/newsletter.json");

const obtenerUsuario = async (req, res) => {
    const user_id = req.params.id;
    con.execute(
        'SELECT university, bio, creation_time, id, email_confirmed, username, picture FROM usuarios WHERE id=?;', [user_id], (err, result1) => {
            if (err) throw err;
            if(result1.length === 0) return res.status(200).json({
                info: 'No existe el usuario solicitado.',
                data: '',
                error: true
            });
            con.execute(
                'SELECT v.id,v.from_user,v.score,v.comment, u.username,u.picture,u.email_confirmed FROM valoraciones v LEFT JOIN usuarios u ON v.from_user=u.id WHERE to_user=?;', [user_id], (err, result2) => {
                    if (err) throw err;
                    con.execute(
                        'SELECT v.*, c.name, c.university, c.region, c.icon, c.banner FROM viajes v INNER JOIN campus c ON v.id_campus=c.id WHERE v.id_user=?;', [user_id], (err, result3) => {
                            if (err) throw err;
                            return res.status(200).json({
                                error: false,
                                data: {
                                    user: result1[0],
                                    ratings: result2,
                                    trips: result3
                                },
                                info: ''
                            });
                        }
                    );
                }
            );
        }
    );
};

const modificarUsuario = async (req, res) => {
    if(req.params.id == req.auth._id){
        const username = req.body.username;
        const bio = req.body.bio;
        const base64 = req.body.picture;
        if(base64.length == 0){
            con.execute('UPDATE usuarios SET username=?, bio=? WHERE id=?;', [username, bio, req.auth._id], (err, result) => {
                    if (err) {
                        return res.status(200).json({
                            error: true,
                            data: '',
                            info: 'No se ha podido modificar el usuario.'
                        });
                    }
                    return res.status(200).json({
                        error: false,
                        info: '',
                        data: 'Usuario modificado con éxito.'
                    });
                }
            );
        }else{
            // Get previous image name and delete it
            con.execute('SELECT picture FROM usuarios WHERE id=?;', [req.auth._id], (err, result) => {
                if (err) console.log(err);
                const previous_path = path.resolve(__dirname, `../../public/img/users/${result[0].picture}`);
                fs.rm(previous_path, {force: true}, function(err){
                    err && console.log(err);
                });
            });
            // Make new id for the img
            const id_image = idMaker('i')+'.png';
            // Get image info
            const image_data = base64.split(';base64,')[1];
            const upload_path = path.resolve(__dirname, `../../public/img/users/${id_image}`);
            con.execute('UPDATE usuarios SET picture=?, username=?, bio=? WHERE id=?;', [id_image, username, bio, req.auth._id], (err, result) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        data: '',
                        info: 'No se ha podido modificar el usuario.'
                    });
                }
                // Save img to file
                fs.writeFile(upload_path, image_data, {encoding: 'base64'}, function(err) {
                    if(err){
                        return res.json({
                            error: true,
                            data: '',
                            info: 'No se ha podido modificar el usuario.'
                        });
                    }else{
                        return res.status(200).json({
                            error: false,
                            info: 'Usuario modificado con éxito.',
                            data: id_image
                        });
                    }
                });
            });
        }
    }else{
        return res.status(403).json({
            error: true,
            data: '',
            info: 'No tienes permisos suficientes.'
        });
    }
};

const modificarUniversidad = async (req, res) => {
    if(req.params.id == req.auth._id){
        con.execute(
            'UPDATE usuarios SET university=? WHERE id=?;', [req.body.university, req.auth._id], (err, result) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        data: '',
                        info: 'No se ha podido cambiar tu universidad.'
                    });
                }
                return res.status(200).json({
                    error: false,
                    info: '',
                    data: 'Universidad elegida con éxito.'
                });
            }
        );
    }else{
        return res.status(403).json({
            error: true,
            data: '',
            info: 'No tienes permisos suficientes.'
        });
    }
};

const modificarPassword = async (req, res) => {
    if(req.params.id == req.auth._id){
        // hash password
        const password = req.body.password;
        const hashedPassword = bcrypt.hashSync(password, 10);
        con.execute(
            'UPDATE usuarios SET password=? WHERE id=?;', [hashedPassword, req.auth._id], (err, result) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        data: '',
                        info: 'No se ha podido cambiar tu contraseña.'
                    });
                }
                return res.status(200).json({
                    error: false,
                    info: '',
                    data: 'Contraseña modificada con éxito.'
                });
            }
        );
    }else{
        return res.status(403).json({
            error: true,
            data: '',
            info: 'No tienes permisos suficientes.'
        });
    }
};

const borrarUsuario = async (req, res) => {
    if(req.params.id == req.auth._id){
        con.execute(
            'DELETE FROM usuarios WHERE id=?;', [req.auth._id], (err, result) => {
                if (err) throw err;
                return res.status(200).json({
                    error: false,
                    data: 'Usuario borrado con éxito.',
                    info: ''
                });
            }
        );
        // Meter en una tabla de tipo historial para prevenir problemas si un usuario tima y se borra la aplicacion para que no lo pillen
        // ...
    }else{
        return res.status(403).json({
            error: true,
            data: '',
            info: 'No tienes permisos suficientes.'
        });
    }
};

const updateRrss = async (req, res) => {
    if(req.params.id == req.auth._id){
        let email = req.body.email;
        let rrss = req.body.rrss;
        let id = req.auth._id;
        con.execute('UPDATE usuarios SET rrss=? WHERE id=?;', [rrss, id], (err, result) => {
            if (err) return res.json({
                info: 'No se ha podido cambiar. Si el error persiste póngase en contacto con nosotros.',
                data: '',
                error: true
            });
            if(rrss == "ACTIVE"){
                // Se suscribe
                fs.readFile(jsonDir, 'utf8', (error, data) => {
                    if(error){
                        return res.status(200).json({
                            error: true,
                            info: 'Se ha producido un error... Inténtalo de nuevo más tarde, disculpa las molestias.',
                            data: ''
                        });
                    }
                    let finalData = JSON.parse(data);
                    let newEntry = {"email": email, "last": new Date(0).toLocaleString()};
            
                    let checked = finalData.emails.filter((element) => element.email === email)[0];
                    if(checked) {
                        return res.status(200).json({
                            error: false,
                            info: '¡Ya estas en la lista! 🎉',
                            data: ''
                        });
                    }else{
                        finalData.lastUpdated = new Date().toDateString();
                        finalData.emails.push(newEntry);
                        fs.writeFile(jsonDir, JSON.stringify(finalData, null, 2), (error) => {
                            if (error) {
                                return res.status(200).json({
                                    error: true,
                                    info: 'Se ha producido un error... Inténtalo de nuevo más tarde, disculpa las molestias.',
                                    data: ''
                                });
                            }
                            return res.status(200).json({
                                error: false,
                                data: '¡Ya estas en la lista! 🎉',
                                info: ''
                            });
                        });
                    }
                });
            }else{
                // Se desuscribe
                fs.readFile(jsonDir, 'utf8', (error, data) => {
                    if(error){
                        return res.status(200).json({
                            error: true,
                            info: 'Se ha producido un error... Inténtalo de nuevo más tarde, disculpa las molestias.',
                            data: ''
                        });
                    }
                    let finalData = JSON.parse(data);
                    let index = finalData.emails.indexOf(email);
                    if(index === -1) return res.status(200).json({error: false, data: 'Ya no recibirás más correos comerciales.', info: ''});
            
                    finalData.emails.splice(index, 1);
            
                    fs.writeFile(jsonDir, JSON.stringify(finalData, null, 2), (error) => {
                        if (error) {
                            return res.status(200).json({
                                error: true,
                                info: 'Se ha producido un error... Inténtalo de nuevo más tarde, disculpa las molestias.',
                                data: ''
                            });
                        }
                        return res.status(200).json({
                            error: false,
                            data: 'Ya no recibirás más correos comerciales.',
                            info: ''
                        });
                    });
                });
            }
        });
    }
};

module.exports = { obtenerUsuario, modificarUsuario, modificarUniversidad, modificarPassword, borrarUsuario, updateRrss };