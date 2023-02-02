
const AWS = require('aws-sdk');
const ses = new AWS.SES({apiVersion: '2010-12-01'});

const sendNewUserEmail = (to) => {
  if(!to) return false;
  const params = {
    Source: "no-reply@unigoapp.es",
    Destination: {
     ToAddresses: [ to ]
    },
    ReplyToAddresses: [ "contacto@unigoapp.es" ],
    Template: 'NuevoUsuario',
    TemplateData: "{ \"email\":\""+ to +"\" }"
  };

  ses.sendTemplatedEmail(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      return false;
    } else {
      console.log(data); 
      return true;
    }
  });
}

const sendResetCodeEmail = (to, resetCode) => {
  if(!to || !resetCode) return false;
  const params = {
    Destination: {
     BccAddresses: [], 
     CcAddresses: [], 
     ToAddresses: [ to ]
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
      return false;
    } else {
      console.log(data); 
      return true;
    }
  });
}

module.exports = { sendNewUserEmail, sendResetCodeEmail };