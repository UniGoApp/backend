const fs = require('fs');
const path = require('path');

const jsonDir = path.join(__dirname, "../../public/public_data/receivedEmails.json");

const getEmails = async (req, res) => {
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

const addEmail = async (req, res) => {
    
    const body = req.body;
    if(!req.body) return;

    console.log(`From: ${body.from}`);
    console.log(`To: ${body.to}`);
    console.log(`Subject: ${body.subject}`);
    console.log(`Text: ${body.text}`);

    const dateTime = new Date();
    let date = dateTime.toLocaleDateString().split('/');
    let time = dateTime.toLocaleTimeString().split(':');
    let day = date[0];
    let month = date[1];
    let year = date[2];
    let hour = time[0];
    let minute = time[1];
    let second = time[2];
    let email_id = 'email_'+day+month+year+'_'+hour+minute+second;

    let newEmail = {
        id: email_id,
        from: body.from,
        to: body.to,
        subject: body.subject,
        text: body.text,
        date: date.toLocaleString()
    };
    
    fs.readFile(jsonDir, 'utf8', (error, data) => {
        if(error){
            return res.status(200).json({
                error: true,
                info: 'Se ha producido un error... Inténtalo de nuevo más tarde, disculpa las molestias.',
                data: ''
            });
        }
        let data = JSON.parse(data);
        data.emails.push(newEmail);
        fs.writeFile(jsonDir, JSON.stringify(data, null, 2), (error) => {
            if (error) {
                return res.status(200).json({
                    error: true,
                    info: 'Se ha producido un error... Inténtalo de nuevo más tarde, disculpa las molestias.',
                    data: ''
                });
            }
            
            return res.status(200).send();
        });
    });
    
};

const removeEmail = async (req, res) => {
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
                    info: 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde... Si el error persiste contacta con nosotros a soporte@unigoapp.es.',
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

const updateEmail = async (req, res) => {
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

module.exports = {getEmails, addEmail, removeEmail, updateEmail};