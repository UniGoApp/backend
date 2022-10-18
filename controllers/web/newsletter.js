const fs = require('fs');
const path = require('path');

const jsonDir = path.join(__dirname, "../../public/public_data/newsletter.json");

const getNewsletter = async (req, res) => {
    if( req.user._rol === "ADMIN" || req.user._rol === "SUPER_ADMIN"){
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
    }else{
        return res.status(403).json({
            msg: 'Acceso no autorizado',
            data: '',
            info: ''
        });
    }
};

const joinNewsletter = async (req, res) => {
    let emailToAdd = req.body.email;
    if(!emailToAdd) return;
    
    fs.readFile(jsonDir, 'utf8', (error, data) => {
        if(error){
            return res.status(200).json({
                error: 'error',
                info: 'Se ha producido un error... Inténtalo de nuevo más tarde, disculpa las molestias.'
            });
        }
        let finalData = JSON.parse(data);
        if(finalData.emails.includes(emailToAdd)) {
            return res.status(200).json({
                error: '',
                info: 'Ya estás entre nuestros contactos favoritos ✨.'
            });
        };
        finalData.emails.push(emailToAdd);
        fs.writeFile(jsonDir, JSON.stringify(finalData, null, 2), (error) => {
            if (error) {
                return res.status(200).json({
                    error: 'error',
                    info: 'Se ha producido un error... Inténtalo de nuevo más tarde, disculpa las molestias.'
                });
            }
            return res.status(200).json({
                error: '',
                info: '¡Te has suscrito con éxito!'
            });
        });
    });
    
};

const removeNewsletter = async (req, res) => {
    let emailToRemove = req.body.email;
    if(!emailToRemove) return;

    fs.readFile(jsonDir, 'utf8', (error, data) => {
        if(error){
            return res.status(200).json({
                error: 'error',
                info: 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde... Si el error persiste contacta con nosotros a soporte@unigoapp.es.'
            });
        }
        let finalData = JSON.parse(data);

        let index = finalData.emails.indexOf(emailToRemove);
        if(index === -1) return res.status(200).json({error: 'error', info: 'No te encontramos en nuestra lista de noticias, si quieres volver a suscribirte puedes hacerlo desde la web. Y si no, ya está todo listo.'});

        finalData.emails.splice(index, 1);

        fs.writeFile(jsonDir, JSON.stringify(finalData, null, 2), (error) => {
            if (error) {
                return res.status(200).json({
                    error: 'error',
                    info: 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde... Si el error persiste contacta con nosotros a soporte@unigoapp.es.'
                });
            }
            return res.status(200).json({
                error: '',
                info: '¡Te echaremos de menos!'
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

module.exports = { getNewsletter, joinNewsletter, removeNewsletter, updateNewsletter };