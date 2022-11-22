const fs = require('fs');
const path = require('path');

const jsonDir = path.join(__dirname, "../../data/newsletter.json");

const getNewsletter = async (req, res) => {
    if( req.user._rol === "ADMIN" || req.user._rol === "SUPER_ADMIN"){
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
    }else{
        return res.status(403).json({
            error: true,
            info: 'Acceso no autorizado',
            data: ''
        });
    }
};

const joinNewsletter = async (req, res) => {
    let emailToAdd = req.body.email;
    let lastToAdd = req.body.last;
    if(!emailToAdd) return;
    
    fs.readFile(jsonDir, 'utf8', (error, data) => {
        if(error){
            return res.status(200).json({
                error: true,
                info: 'Se ha producido un error... Inténtalo de nuevo más tarde, disculpa las molestias.',
                data: ''
            });
        }
        let finalData = JSON.parse(data);
        let newEntry = {"email": emailToAdd, "last": lastToAdd};

        let checked = finalData.emails.filter((element) => element.email === emailToAdd)[0];
        if(checked) {
            return res.status(200).json({
                error: false,
                info: 'Ya estás entre nuestros contactos favoritos ✨.',
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
                    info: '¡Te has suscrito con éxito!',
                    data: ''
                });
            });
        }
    });
};

const removeNewsletter = async (req, res) => {
    let emailToRemove = req.body.email;
    if(!emailToRemove) return;

    fs.readFile(jsonDir, 'utf8', (error, data) => {
        if(error){
            return res.status(200).json({
                error: true,
                info: 'Se ha producido un error... Inténtalo de nuevo más tarde, disculpa las molestias.',
                data: ''
            });
        }
        let finalData = JSON.parse(data);

        let index = finalData.emails.indexOf(emailToRemove);
        if(index === -1) return res.status(200).json({error: true, info: 'No te encontramos en nuestra lista de noticias, si quieres volver a suscribirte puedes hacerlo desde la web. Y si no, ya está todo listo.', data: ''});

        finalData.emails.splice(index, 1);

        fs.writeFile(jsonDir, JSON.stringify(finalData, null, 2), (error) => {
            if (error) {
                return res.status(200).json({
                    error: true,
                    info: 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde... Si el error persiste contacta con nosotros a contacto@unigoapp.es.',
                    data: ''
                });
            }
            return res.status(200).json({
                error: false,
                info: '¡Te echaremos de menos!',
                data: ''
            });
        });
    });
};

const updateNewsletter = async (req, res) => {
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

module.exports = { getNewsletter, joinNewsletter, removeNewsletter, updateNewsletter };