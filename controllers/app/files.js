const path = require('path');

const getUserPic = async (req, res) => {
    const path_name = path.resolve(__dirname, '../../public/img/users');
    const options = {
        root: path_name,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    
    const fileName = req.params.name;
    res.sendFile(fileName, options, (err) => {
        if (err) {
            res.sendFile('user_default.png', options, (err) => {
                if (err) {
                    console.log('err :>> ', err);
                }
            });
        }
    });
};

const getUniPic = async (req, res) => {
    const path_name = path.resolve(__dirname, '../../public/img/universidades');
    const options = {
        root: path_name,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    
    const fileName = req.params.name;
    res.sendFile(fileName, options, (err) => {
        if (err) {
            res.sendFile('default.png', options, (err) => {
                if (err) {
                    console.log('err :>> ', err);
                }
            });
        }
    });
};

module.exports = { getUserPic, getUniPic };