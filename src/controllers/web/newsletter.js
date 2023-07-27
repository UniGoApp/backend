const fs = require('fs');
const path = require('path');
const jsonDir = path.join(__dirname, "../../data/newsletter.json");

const joinNewsletter = async (req, res) => {
    let emailToAdd = req.body.email;
    let lastToAdd = req.body.last;
    if(!emailToAdd) return;
    
    fs.readFile(jsonDir, 'utf8', (err, data) => {
        if(err) throw new Error('InternalServerError');
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
            fs.writeFile(jsonDir, JSON.stringify(finalData, null, 2), (err) => {
                if (err) throw new Error('InternalServerError');
                return res.status(200).json({
                    error: false,
                    info: 'Ya estás entre nuestros contactos favoritos ✨.',
                    data: ''
                });
            });
        }
    });
};

const removeNewsletter = async (req, res) => {
    let emailToRemove = req.body.email;
    if(!emailToRemove) return;

    fs.readFile(jsonDir, 'utf8', (err, data) => {
        if (err) throw new Error('InternalServerError');
        let finalData = JSON.parse(data);

        let item = finalData.emails.filter(item => item.email === emailToRemove);
        let index = finalData.emails.indexOf(item[0]);
        if(index === -1) return res.status(200).json({error: true, info: 'No te encontramos en nuestra lista de noticias, si quieres volver a suscribirte puedes hacerlo desde la web. Y si no, ya está todo listo.', data: ''});

        finalData.emails.splice(index, 1);

        fs.writeFile(jsonDir, JSON.stringify(finalData, null, 2), (err) => {
            if (err) throw new Error('InternalServerError');
            return res.status(200).json({
                error: false,
                info: '¡Te echaremos de menos!',
                data: ''
            });
        });
    });
};

module.exports = { joinNewsletter, removeNewsletter };