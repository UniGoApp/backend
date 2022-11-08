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
    if(!body) return;

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
                info: 'Ha ocurrido un error al leer el archivo.',
                data: ''
            });
        }
        let prevData = JSON.parse(data);
        prevData.emails.push(newEmail);
        fs.writeFile(jsonDir, JSON.stringify(prevData, null, 2), (error) => {
            if (error) {
                return res.status(200).json({
                    error: true,
                    info: 'Ha ocurrido un error al escribir el archivo.',
                    data: ''
                });
            }
            return res.status(200).send();
        });
    });
    
};

const removeEmail = async (req, res) => {
    let emailToRemove = req.body.email_id;
    if(!emailToRemove) return;

    fs.readFile(jsonDir, 'utf8', (error, data) => {
        if(error){
            return res.status(200).json({
                error: true,
                info: 'Ha ocurrido un error al leer el archivo.',
                data: ''
            });
        }
        let finalData = JSON.parse(data);
        let index = finalData.emails.findIndex(email => email.id === emailToRemove)
        if(index === -1) return res.status(200).json({error: true, info: 'No existe el correo solicitado.', data: ''});

        finalData.emails.splice(index, 1);

        fs.writeFile(jsonDir, JSON.stringify(finalData, null, 2), (error) => {
            if (error) {
                return res.status(200).json({
                    error: true,
                    info: 'Ha ocurrido un error al escribir el archivo.',
                    data: ''
                });
            }
            return res.status(200).json({
                error: false,
                info: 'Email borrado correctamente.',
                data: ''
            });
        });
    });
};

const sendEmails = async (req,res) => {

};
const answerEmail = async (req,res) => {

};

module.exports = {getEmails, addEmail, removeEmail, sendEmails, answerEmail};