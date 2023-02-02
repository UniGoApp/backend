const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {nanoid} = require("nanoid");
const con = require("../database");

const {sendNewUserEmail, sendResetCodeEmail} = require('./emails');

const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  con.execute('SELECT * FROM usuarios WHERE email=? OR phone=?;', [email, phone], (err, result) => {
    if (err) return res.status(200).json({error: true, info: "Unexpected error", data:''});
    if(result.length !== 0){
      return res.status(200).json({error: true, info: "Email or phone already in use!", data:''});
    } else {
      let dateTime = new Date().toJSON().split('T');
      let date = dateTime[0].replaceAll('-','');
      let time = dateTime[1].split('.')[0].replaceAll(':','');
      let id = `u_${date}_${time}`;
      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);
      // Add new user
      con.execute('INSERT INTO usuarios (id, email, password, username, phone) VALUES (?, ?, ?, ?, ?);', [id, email, hashedPassword, name, phone], (err, result) => {
        if (err) return res.json({error: true, info: "Unexpected error", data:''});
        // Create token
        const token = jwt.sign({ _id: id, _rol: "USER" }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        // Send mail
        const didSend = sendNewUserEmail(email);
        console.log('didSend: ', didSend);
        if(didSend){
          return res.status(200).json({
            error: false,
            info: '¡Usuario creado con éxito!',
            data: {
              token,
              user: {
                _id: result.insertId,
                email: email
              }
            }
          });
        }else{
          return res.status(200).json({error: true, info: 'Fallo al enviar el email.', data: ''});
        }
      });
    }
  });
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    con.execute('SELECT * FROM usuarios WHERE email=? AND rol=?;', [email, 'USER'], function (err, result) {
        if (err) {
          console.log('Error de conexion: ', err);
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
          expiresIn: "90d",
        });
        return res.status(200).json({
          error: false,
          info: '',
          data:{
            token,
            user: result[0],
          }
        });
    });
};

const forgotPassword = async (req, res) => {
	const email = req.body.email;
	// Find user by email
	con.execute('SELECT * FROM usuarios WHERE email=?;', [email], function (err, result) {
		if (err) return res.json({error: true, info: "Unexpected error", data:''});
		if(result.length == 0){
			return res.json({error: true, info: "Este usuario no existe.", data:''});
		} else {
      // Generate code
      const resetCode = nanoid(6).toUpperCase();
			// save resetCode to db
			con.query('UPDATE usuarios SET reset_code=? WHERE email=?;', [resetCode, email], async function(err) {
        if(err) return res.json({error: true, info: "Unexpected error", data:''});
        // Send mail
        const didSend = await sendResetCodeEmail(email, resetCode);
        console.log('didSend: ', didSend);
        if(didSend){
          return res.json({error: false, info: '', data: 'Código enviado con éxito.'});
        }else{
          return res.json({error: true, info: 'Fallo al enviar el email.', data: ''});
        }
			});
		}
	});
  
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetCode } = req.body;
    // find user based on email and resetCode
    con.execute('SELECT * FROM usuarios WHERE email=? AND reset_code=?;', [email, resetCode], function (err, result) {
      if (err) return res.json({error:true, info: "Unexpected error", data: ''});
      if(result.length == 0){
        return res.json({error:true, info: "Email o código introducido no es válido.", data:''});
      } else {
        // hash password
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        con.query('UPDATE usuarios SET password=?, reset_code="" WHERE email=?;', [hashedPassword, email], function(err) {
          if(err) return res.json({error:true, info: "Unexpected error", data: ''});
        });

        return res.json({error: false, info: '', data: "Contraseña cambiada con éxito, por favor inicie sesion."});
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {signup, signin, forgotPassword, resetPassword};