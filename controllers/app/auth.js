const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {nanoid, customAlphabet} = require("nanoid");
const con = require("../database");
const { idMaker } = require("../../helpers/idMaker");
const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

AWS.config.update({
  accessKeyId: process.env.AWS_S3_accessKeyId,
  secretAccessKey: process.env.AWS_S3_secretAccessKey,
  region: process.env.AWS_REGION
});
const ses = new AWS.SES({apiVersion: '2010-12-01'});

const signup = async (req, res) => {
  let { name, email, phone, password, bio, picture } = req.body;
  con.execute('SELECT * FROM usuarios WHERE email=? OR phone=?;', [email, phone], (err, result) => {
    if (err) return res.status(200).json({error: true, info: "Unexpected error", data:''});
    if(result.length !== 0){
      return res.status(200).json({error: true, info: "Email o teléfono en uso.", data:''});
    } else {
      if(!bio) bio = '';
      let picName;
      if(!picture || picture.length == 0){
        picName = 'user_default.png';
      }else{
        picName = idMaker('i')+'.png';
        // Get image info
        const image_data = picture.split(';base64,')[1];
        const upload_path = path.resolve(__dirname, `../../public/img/users/${picName}`);
        // Save img to file
        fs.writeFile(upload_path, image_data, {encoding: 'base64'}, function(err) {
          err && console.log(err);
        });
      }
      const id = idMaker('u');
      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);
      // Add new user
      con.execute('INSERT INTO usuarios (id, email, password, username, phone, bio, picture) VALUES (?, ?, ?, ?, ?, ?, ?);', [id, email, hashedPassword, name, phone, bio, picName], (err, result) => {
        if (err) return res.json({error: true, info: "Unexpected error", data:''});
        // Send mail
        const params = {
          Source: "no-reply@unigoapp.es",
          Destination: {
           ToAddresses: [ email ]
          },
          ReplyToAddresses: [ "contacto@unigoapp.es" ],
          Template: 'NuevoUsuario',
          TemplateData: "{ \"email\":\""+ email +"\" }"
        };
        ses.sendTemplatedEmail(params, function(err, data) {
          err && console.log('Error al enviar email: ', err);
          // create signed token
          const token = jwt.sign({ _id: id, _rol: 'USER' }, process.env.JWT_SECRET, {
            expiresIn: "360d",
          });
          con.execute('SELECT creation_time,email_confirmed,university FROM usuarios WHERE id=?;', [id], function (err, resultUser) {
            if (err) {
              return res.status(400).json({error: true, info: "Se ha producido un error, inicie sesión.", data:''});
            }
            return res.status(200).json({
              error: false,
              info: '¡Usuario creado con éxito!',
              data:{
                token,
                user: {
                  id: id, 
                  username: name,
                  email: email,
                  phone: phone,
                  role: 'USER',
                  bio: bio,
                  picture: picName,
                  rrss: 'ACTIVE',
                  creation_time: resultUser[0].creation_time,
                  email_confirmed: resultUser[0].email_confirmed,
                  university: resultUser[0].university
                },
              }
            });
          });
        });
      });
    }
  });
};

const getAuthCode = async (req, res) => {
  const id_user = req.auth._id;
  const email = req.body.email;
  // Generate code
  const nanoidNumbers = customAlphabet('1234567890', 4);
  const authCode = nanoidNumbers(4);
  // save resetCode to db
  con.execute('UPDATE usuarios SET auth_code=? WHERE email=? AND id=?;', [authCode, email, id_user], async function(err, data) {
    if(err || data.affectedRows < 1) return res.json({error: true, info: "Ha ocurrido un problema con su solicitud, inténtelo más adelante.", data:''});
    // Send mail
    const params = {
      Destination: {
       ToAddresses: [ email ]
      }, 
      Message: {
       Body: {
        Html: {
         Charset: "UTF-8", 
         Data: `<h4>Código de verificación: </h4><h2>${authCode}</h2><p>Por favor borra este mensaje si no has solicitado este código.</p>`
        }, 
        Text: {
         Charset: "UTF-8", 
         Data: `\n\tCódigo de verificación: ${authCode}.\n\nPor favor borra este mensaje si no has solicitado este código.`
        }
       }, 
       Subject: {
        Charset: "UTF-8", 
        Data: "UniGo - Auth Code"
       }
      }, 
      Source: "no-reply@unigoapp.es",
      ReplyToAddresses: [ "contacto@unigoapp.es" ]
    };
    ses.sendEmail(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        return res.json({error: true, info: 'Fallo al enviar el email.', data: ''});
      } else {
        return res.json({error: false, info: '', data: 'Código enviado con éxito.'});
      }
    });
  });
};

const verifyUser = async (req,res) => {
  const code = req.body.code;
  const id_user = req.auth._id;
  con.execute('SELECT auth_code FROM usuarios WHERE id=?;', [id_user], function (err, result) {
    if (err) {
      return res.status(400).json({error: true, info: "Se ha producido un error.", data:''});
    }
    let sameCode = result[0].auth_code === code;
    if(sameCode){
      con.execute('UPDATE usuarios SET auth_code="", email_confirmed=1 WHERE id=?;', [id_user], async function(err) {
        if(err) {
          return res.json({error: true, info: "Error al verificar el perfil del usuario.", data:''});
        }
        return res.json({error: false, info: '', data:'Perfil verificado con éxito.'});
      });
    }else{
      return res.json({error: true, info: "Error al verificar el perfil del usuario.", data:''});
    }
  });
};
const signin = async (req, res) => {
    const { email, password } = req.body;
    con.execute('SELECT id,username,password,email,phone,role,bio,picture,creation_time,rrss,email_confirmed,university FROM usuarios WHERE email=?;', [email], function (err, result) {
        if (err) {
          return res.status(400).json({error: true, info: "Se ha producido un error.", data:''});
        }
        if(result.length === 0){
          return res.status(404).json({error: true, info: "Este usuario no existe.", data:''});
        }
        const match = bcrypt.compareSync(password, result[0].password);
        if (!match) {
          return res.status(401).json({error: true, info: "Contraseña incorrecta.", data:''});
        }
        // create signed token
        const token = jwt.sign({ _id: result[0].id, _rol: result[0].role }, process.env.JWT_SECRET, {
          expiresIn: "360d",
        });
        return res.status(200).json({
          error: false,
          info: '',
          data:{
            token,
            user: {
              id: result[0].id, 
              username: result[0].username,
              email: result[0].email,
              phone: result[0].phone,
              role: result[0].role,
              bio: result[0].bio,
              picture: result[0].picture,
              creation_time: result[0].creation_time,
              rrss: result[0].rrss,
              email_confirmed: result[0].email_confirmed,
              university: result[0].university
            },
          }
        });
    });
};

const forgotPassword = async (req, res) => {
	const email = req.body.email;
	// Find user by email
	con.execute('SELECT * FROM usuarios WHERE email=?;', [email], function (err, result) {
		if (err) return res.json({error: true, info: "Unexpected error 1", data:''});
		if(result.length == 0){
			return res.json({error: true, info: "Este usuario no existe.", data:''});
		} else {
      // Generate code
      const resetCode = nanoid(6).toUpperCase();
			// save resetCode to db
			con.execute('UPDATE usuarios SET reset_code=? WHERE email=?;', [resetCode, email], async function(err) {
        if(err) return res.json({error: true, info: "Unexpected error 2", data:''});
        // Send mail
        const params = {
          Destination: {
           ToAddresses: [ email ]
          }, 
          Message: {
           Body: {
            Html: {
             Charset: "UTF-8", 
             Data: `<h4>Código: </h4><h2>${resetCode}</h2><p>Por favor borra este mensaje si no has solicitado este código.</p>`
            }, 
            Text: {
             Charset: "UTF-8", 
             Data: `\n\tCódigo: ${resetCode}.\n\nPor favor borra este mensaje si no has solicitado este código.`
            }
           }, 
           Subject: {
            Charset: "UTF-8", 
            Data: "UniGo - Reset Password Code"
           }
          }, 
          Source: "no-reply@unigoapp.es",
          ReplyToAddresses: [ "contacto@unigoapp.es" ]
        };
        ses.sendEmail(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
            return res.json({error: true, info: 'Fallo al enviar el email.', data: ''});
          } else {
            return res.json({error: false, info: '', data: 'Código enviado con éxito.'});
          }
        });
			});
		}
	});
};

const resetPassword = async (req, res) => {
  const { email, newPassword, resetCode } = req.body;
  // find user based on email and resetCode
  con.execute('SELECT * FROM usuarios WHERE email=? AND reset_code=?;', [email, resetCode], function (err, result) {
    if (err) return res.json({error:true, info: "Unexpected error", data: ''});
    if(result.length == 0){
      return res.json({error:true, info: "Email o código introducido no es válido.", data:''});
    } else {
      // hash password
      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      con.execute('UPDATE usuarios SET password=?, reset_code="" WHERE email=?;', [hashedPassword, email], function(err) {
        if(err) return res.json({error: true, info: "Unexpected error", data: ''});
      });
      return res.json({error: false, info: '', data: 'Contraseña cambiada con éxito, por favor inicie sesion.'});
    }
  });
};

module.exports = {signup, signin, forgotPassword, resetPassword, getAuthCode, verifyUser};