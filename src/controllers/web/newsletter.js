const fs = require('fs');
const path = require('path');
const jsonDir = path.join(__dirname, "../../data/newsletter.json");

const joinNewsletter = async (req, res) => {
    let emailToAdd = req.body.email;
    let lastToAdd = req.body.last;
    if(!emailToAdd) return;
    
    fs.readFile(jsonDir, 'utf8', (err, data) => {
        if (err) throw new Error('InternalServerError');
        let finalData = JSON.parse(data);
        let newEntry = {"email": emailToAdd, "last": lastToAdd};
        let checked = finalData.emails.filter((element) => element.email === emailToAdd)[0];
        if (checked) {
            return res.status(200).json({ error: false, data: 'Ya estás entre nuestros contactos favoritos ✨.' });
        } else {
            finalData.lastUpdated = new Date().toDateString();
            finalData.emails.push(newEntry);
            fs.writeFile(jsonDir, JSON.stringify(finalData, null, 2), (err) => {
                if (err) throw new Error('InternalServerError');
                return res.status(200).json({ error: false, data: 'Ya estás entre nuestros contactos favoritos ✨.' });
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
        if (index === -1) return res.status(200).json({error: true, data: 'No estás entre nuestros contactos, si quieres volver a suscribirte puedes hacerlo desde la web.'});

        finalData.emails.splice(index, 1);

        fs.writeFile(jsonDir, JSON.stringify(finalData, null, 2), (err) => {
            if (err) throw new Error('InternalServerError');
            return res.status(200).json({ error: false, data: '¡Te echaremos de menos!' });
        });
    });
};

module.exports = { joinNewsletter, removeNewsletter };