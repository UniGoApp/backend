const fs = require('fs');
const jsonDir = "../../../public/public_data/newsletter.json";

const getNewsletter = async (req, res) => {
    if( req.user._rol === "ADMIN" || req.user._rol === "SUPER_ADMIN"){
        fs.readFile(jsonDir, "utf8", (err, data) => {
            if (err) {
              console.log("Error reading file from disk:", err);
              return;
            }
            try {
              const jsonData = JSON.parse(data);
              console.log('emails: ', jsonData);
            } catch (err) {
              console.log("Error parsing JSON string:", err);
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
           console.log(error);
           return;
        }

        let finalData = JSON.parse(data);
        console.log('data from newsletter.json :>> ', finalData);

        finalData.emails.push(emailToAdd);

        fs.writeFile(jsonDir, JSON.stringify(finalData, null, 2), (error) => {
            if (error) {
              console.log('An error has occurred: ', error);
              return;
            }
            console.log('Data written successfully to disk.');
        });
    });
    
};

const removeNewsletter = async (req, res) => {
    let emailToRemove = req.body.email;
    if(!emailToRemove) return;

    fs.readFile(jsonDir, 'utf8', (error, data) => {
        if(error){
           console.log(error);
           return;
        }

        let finalData = JSON.parse(data);
        console.log('data from newsletter.json :>> ', finalData);

        let index = finalData.emails.indexOf(emailToRemove);
        if(index === -1) return;

        finalData.emails.splice(index, 1);

        fs.writeFile(jsonDir, JSON.stringify(finalData, null, 2), (error) => {
            if (error) {
              console.log('An error has occurred: ', error);
              return;
            }
            console.log('Data written successfully to disk.');
        });
    });
};

module.exports = { getNewsletter, joinNewsletter, removeNewsletter };