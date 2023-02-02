const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_S3_accessKeyId,
  secretAccessKey: process.env.AWS_S3_secretAccessKey,
  region: process.env.AWS_REGION
});
const ses = new AWS.SES({apiVersion: '2010-12-01'});

const sendNewUserEmail = async (to) => {
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

  return await ses.sendTemplatedEmail(params);
}

const sendResetCodeEmail = async (to, resetCode) => {
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

  return await ses.sendEmail(params);
}

module.exports = { sendNewUserEmail, sendResetCodeEmail };