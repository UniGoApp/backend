const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const con = require("../../config/database");
const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../data/loginFailure.json');

function createNewLog(req, cause){
	let access = {};
	access.cause = cause;
	access.email = req.body.email;
	access.password = req.body.password;
	access.date = new Date().toLocaleString();
	access.ip = req.ip;
	access.protocol = req.protocol;
	fs.readFile(logsDir, "utf8", (err, data) => {
		if(err) throw new Error('InternalServerError');
		var json = JSON.parse(data);
		json.logs.push(access);
		fs.writeFile(logsDir, JSON.stringify(json, null, 4), (err) => {
			throw new Error('InternalServerError');
		});
	});
}

function checkEmail(req, res){
	const { email, password } = req.body;
    con.execute('SELECT * FROM usuarios WHERE email=? AND (role="ADMIN" OR role="SUPER_ADMIN") LIMIT 1;', [email], function (err, result) {
        if (err) throw new Error('InternalServerError');
        if(result.length === 0){
			createNewLog(req, 'Email incorrecto');
        	return res.status(404).json({error: "Este usuario no existe."});
        }
		const match = bcrypt.compareSync(password, result[0].password);
		if (!match) {
			createNewLog(req, 'Contraseña incorrecta');
			return res.status(401).json({error: "Contraseña incorrecta."});
		}
		// -> create signed token
		const token = jwt.sign({ _id: result[0].id, _role: result[0].role }, process.env.JWT_SECRET, {
			expiresIn: "3d",
		});
		// -> send response
		res.status(200).json({
			token,
			user: result[0],
		});
    });
};

const signinAdmin = async (req, res) => {
	//Check if IP is trying to access at least 3 times
	let count = 0;
	fs.readFile(logsDir, "utf8", function (err, data) {
		if(err) throw new Error('InternalServerError');
		var json = JSON.parse(data);
		json.logs.forEach(failureInfo => {
			if(req.ip == failureInfo.ip){
				count++;
			}
		});
		if (count > 2) {
			return res.status(400).json({error: "System is down. Please contact administrators."});
		}else{
			checkEmail(req, res);
		}
	});
};

const forgotPasswordAdmin = async (req, res) => {
	const email = req.body.email;
	// find user by email
	con.execute('SELECT * FROM usuarios WHERE email=? AND (role=? OR role=?);', [email, "ADMIN", "SUPER_ADMIN"], function (err, result) {
		if (err) throw new Error('InternalServerError');
		if(result.length == 0){
			return res.json({error: true, info: "Este usuario no existe."});
		} else {
			// Generate code
			const resetCode = nanoid(12).toUpperCase();
			// save resetCode to db
			con.execute('UPDATE usuarios SET reset_code=? WHERE email=?;', [resetCode, email], function(err) {
				if(err) throw new Error('InternalServerError');
				// Send mail
				const params = {
					Destination: { ToAddresses: [ email ] }, 
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
					if (err) throw new Error('InternalServerError');
					else return res.json({error: false, info: '', data: 'Código enviado con éxito.'});
				});
			});
		}
	});
};

const resetPasswordAdmin = async (req, res) => {
    const { email, newPassword, resetCode } = req.body;
    // find user based on email and resetCode
    con.execute('SELECT * FROM usuarios WHERE email=? AND reset_code=?;', [email, resetCode], function (err, result) {
		if (err) throw new Error('InternalServerError');
		if(result.length == 0) return res.json({error:true, info: "Email o código introducido no es válido.", data:""});
		// hash password
		const hashedPassword = bcrypt.hashSync(newPassword, 10);
		con.execute('UPDATE usuarios SET password=?, resetCode="" WHERE email=?;', [hashedPassword, email], function(err) {
			if(err) throw new Error('InternalServerError');
			return res.json({error: false, info: "Contraseña cambiada con éxito, por favor inicie sesión.", data: ""});
		});

    });
};

const changePasswordAdmin = async (req, res) => {
	if(req.auth._id === req.params.id){
		const { email, newPassword } = req.body;
		const hashedPassword = bcrypt.hashSync(newPassword, 10);
		con.execute('UPDATE usuarios SET password=? WHERE email=? AND id=?;', [hashedPassword, email, req.params.id], (err) => {
			if(err) throw new Error('InternalServerError');
			return res.json({error: false, info: 'Contraseña cambiada con éxito.', data: ''});
		});
	}else{
		throw new Error('UnauthorizedError');
	}
};

module.exports = { signinAdmin, forgotPasswordAdmin, resetPasswordAdmin, changePasswordAdmin };