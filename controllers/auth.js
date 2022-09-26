const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nanoid = require("nanoid");
const con = require("./database");
const nodemailer = require('nodemailer');

const JWT_SECRET = 'CreacionDeTokensSegurosParaUsuarios_UnicarApp2022';

const signup = async (req, res) => {
  try {
    // validation
    const { name, email, phone, password } = req.body;
    
    con.execute(
      'SELECT * FROM `usuarios` WHERE `email` = ? OR `phone` = ?', [email, phone], (err, result) => {
        if (err) return res.json({error: "Unexpected error"});
        if(result.length !== 0){
          return res.status(409).json({error: "Email or phone already in use!"});
        } else {
          // hash password
          const hashedPassword = bcrypt.hashSync(password, 10);
          const default_picture = "../assets/user_default.png";
          con.execute('INSERT INTO `usuarios` (email, password, username, rol, phone, picture) VALUES (?, ?, ?, ?, ?, ?)', [email, hashedPassword, name, 'USER', phone, default_picture], (err, result) => {
            if (err) return res.json({error: "Unexpected error"});
            //console.log("User created: "+ result.insertId);
            const token = jwt.sign({ _id: result.insertId, _rol: result[0].rol }, JWT_SECRET, {
              expiresIn: "7d",
            });

            return res.status(200).json({
                message: "User created successfully.",
                token,
                user: {
                  _id: result.insertId,
                  email: email
                }
            });
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const signin = async (req, res) => {

  try {
    const { email, password } = req.body;
    con.execute('SELECT * FROM `usuarios` WHERE `email` = ?', [email], function (err, result) {
        if (err) return res.json({error: "Unexpected error"});
        if(result.length === 0){
          return res.status(404).json({error: "User not found"});
        } else {
          const match = bcrypt.compareSync(password, result[0].password);
          if (!match) return res.status(401).json({error: "Wrong password"});

          // create signed token
          const token = jwt.sign({ _id: result[0].id, _rol: result[0].rol }, JWT_SECRET, {
            expiresIn: "7d",
          });
          
          res.status(200).json({
            token,
            user: result[0],
          });
        }
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

const forgotPassword = async (req, res) => {
  const email = req.body.email;

  let testAccount = await nodemailer.createTestAccount();
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // Generate code
  const resetCode = nanoid(6).toUpperCase();
  //Prepare email
  const emailData = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "UniCar Reset Password Code", // Subject line
    text: `Your password reset code is: ${resetCode}. Please delete this message if you haven't requested this change. For security reasons we reccomend you to go to your UNICAR account settings and change your password.`, // plain text body
    html: `
    <h4>Your password reset code is: </h4>
    <h2>${resetCode}</h2>
    <p>Please delete this message if you haven't requested this change. For security reasons we reccomend you to go to your UNICAR account settings and change your password.</p>`, // html body
  };

  // find user by email
  con.execute('SELECT * FROM `usuarios` WHERE `email` = ?', [email], function (err, result) {
      if (err) return res.json({error: "Unexpected error"});
      if(result.length == 0){
        return res.json({error: "Este usuario no existe."});
      } else {
        // save resetCode to db
        con.query('UPDATE `usuarios` SET `resetCode` = ? WHERE `email` = ?', [resetCode, email], function(err) {
          if(err) return res.json({error: "Unexpected error"});
          sendMail(transporter, emailData);
          return res.json({info: 'Código enviado con éxito.'});
        });
      }
  });
  
};

const sendMail = async (transporter, emailData) =>{
  // send mail data with defined transport object
  let info = await transporter.sendMail(emailData);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetCode } = req.body;
    // find user based on email and resetCode
    con.execute('SELECT * FROM `usuarios` WHERE `email` = ? AND `resetCode` = ?', [email, resetCode], function (err, result) {
      if (err) return res.json({error: "Unexpected error"});
      if(result.length == 0){
        return res.json({error: "Email o código introducido no es válido."});
      } else {
        // hash password
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        con.query('UPDATE `usuarios` SET `password` = ?, `resetCode` = "" WHERE `email` = ?', [hashedPassword, email], function(err) {
          if(err) return res.json({error: "Unexpected error"});
        });

        return res.json({info: "Contraseña cambiada con éxito, por favor inicie sesion."});
      }
    });
  } catch (err) {
    console.log(err);
  }
};


module.exports = {signup, signin, forgotPassword, resetPassword};