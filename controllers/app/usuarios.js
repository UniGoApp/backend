const con = require("../database");
const fs = require('fs');
const path = require('path');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const jsonDir = path.join(__dirname, "../../data/newsletter.json");

const obtenerUsuario = async (req, res) => {
    const user_id = req.params.id;
    con.execute(
        'SELECT u.id_campus, u.bio, u.creation_time, c.name AS campus, c.university, c.region, c.icon FROM usuarios AS u LEFT JOIN campus AS c ON c.id=u.id_campus WHERE u.id=?;', [user_id], (err, result1) => {
            if (err) throw err;
            if(result1.length === 0) return res.status(200).json({
                info: 'No existe el usuario solicitado.',
                data: '',
                error: true
            });
            con.execute(
                'SELECT * FROM valoraciones WHERE to_user=?;', [user_id], (err, result2) => {
                    if (err) throw err;
                    con.execute(
                        'SELECT * FROM viajes WHERE status=? AND id_user=?;', ['ACTIVO', user_id], (err, result3) => {
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
        con.execute(
            'UPDATE usuarios SET username=?, bio=? WHERE id=?;', [req.body.username, req.body.bio, req.auth._id], (err, result) => {
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