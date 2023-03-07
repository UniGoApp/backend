const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {nanoid} = require("nanoid");
const con = require("../database");
const { idMaker } = require("../../helpers/idMaker");
const AWS = require('aws-sdk');
const { updateRrss } = require("./usuarios");
AWS.config.update({
  accessKeyId: process.env.AWS_S3_accessKeyId,
  secretAccessKey: process.env.AWS_S3_secretAccessKey,
  region: process.env.AWS_REGION
});
const ses = new AWS.SES({apiVersion: '2010-12-01'});

const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;
  con.execute('SELECT * FROM usuarios WHERE email=? OR phone=?;', [email, phone], (err, result) => {
    if (err) return res.status(200).json({error: true, info: "Unexpected error", data:''});
    if(result.length !== 0){
      return res.status(200).json({error: true, info: "Email o teléfono en uso.", data:''});
    } else {
      // let dateTime = new Date().toJSON().split('T');
      // let date = dateTime[0].replaceAll('-','');
      // let time = dateTime[1].split('.')[0].replaceAll(':','');
      // let id = `u_${date}_${time}`;
      const id = idMaker('u');
      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);
      // Add new user
      con.execute('INSERT INTO usuarios (id, email, password, username, phone) VALUES (?, ?, ?, ?, ?);', [id, email, hashedPassword, name, phone], (err, result) => {
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
          if (err) {
            console.log(err, err.stack);
            return res.status(200).json({error: true, info: 'Fallo al enviar el email.', data: ''});
          } else {
            console.log(data); 
            return res.status(200).json({
              error: false,
              info: '¡Usuario creado con éxito!',
              data: ''
            });
          }
        });
      });
    }
  });
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    con.execute('SELECT id,username,password,email,phone,rol,bio,picture,creation_time,rrss,email_confirmed,university FROM usuarios WHERE email=?;', [email], function (err, result) {
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
        const token = jwt.sign({ _id: result[0].id, _rol: result[0].rol }, process.env.JWT_SECRET, {
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
              rol: result[0].rol,
              bio: result[0].bio,
              picture: result[0].picture,
              creation_time: result[0]. creation_time,
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
             Data: `<h4>Código: </h4><h2>${resetCode}</h2><p>Por favor borra este mensaje si no has solicitado este cambio de contraseña.</p>`
            }, 
            Text: {
             Charset: "UTF-8", 
             Data: `\n\tCódigo: ${resetCode}.\n\nPor favor borra este mensaje si no has solicitado este cambio de contraseña.`
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
            console.log(data); 
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

module.exports = {signup, signin, forgotPassword, resetPassword};