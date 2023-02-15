const AWS = require('aws-sdk');

// Create the parameters for calling listObjects
AWS.config.update({
    accessKeyId: process.env.AWS_S3_accessKeyId,
    secretAccessKey: process.env.AWS_S3_secretAccessKey,
    region: process.env.AWS_REGION
});
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_S3_BucketName;

const getEmails = async (req, res) => {
    let bucketParams = {
        Bucket : BUCKET_NAME,
    };
    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjects(bucketParams, function(err, data) {
        if (err) {
            console.log("Error", err);
            return res.status(200).json({
                error: true,
                info: 'Error del servidor',
                data: ''
            });
        } else {
            data = data.Contents;
            if(data.length === 0) {
                return res.status(200).json({
                    error: true,
                    info: 'No hay emails',
                    data: ''
                });
            }else{
                return res.status(200).json({
                    error: false,
                    info: '',
                    data: data
                });
            }
        }
    });
}

const getEmail = async (req, res) => {
    const id = req.params.id;
    const getParams = {
        Bucket: process.env.AWS_S3_BucketName,
        Key: `Emails/${id}`
    }

    s3.getObject(getParams, function(err, data) {
        if (err) {
            return res.status(200).json({
                error: true,
                info: 'Error del servidor',
                data: ''
            });
        } else {
            let objectData = data.Body.toString('utf-8');
            return res.status(200).json({
                error: false,
                info: '',
                data: objectData
            });
        }
    });
}

const deleteEmail = async (req, res) => {
    const id = req.params.id;
    const deleteParams = {
        Bucket: process.env.AWS_S3_BucketName,
        Key: `Emails/${id}`
    }

    s3.deleteObject(deleteParams, function(err, data) {
        if (err) {
            return res.status(200).json({
                error: true,
                info: 'No se ha podido borrar el correo.',
                data: ''
            });
        } else {
            return res.status(200).json({
                error: false,
                info: 'Correo borrado con éxito.',
                data: ''
            });
        }
    });
};

const responderEmail = async(req, res) => {
    const dest = req.body.to;
    const subject = req.body.subject;
    const content = req.body.content;
    // Create sendEmail params 
    var params = {
        Destination: {
            BccAddresses: [],
            CcAddresses: [],
            ToAddresses: [dest]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `<p>${content}</p>`
                },
                Text: {
                    Charset: "UTF-8",
                    Data: content
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
            },
        Source: 'contacto@unigoapp.es',
        ReplyToAddresses: ['contacto@unigoapp.es']
    };
  
    // Create the promise and SES service object
    var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    
    // Handle promise's fulfilled/rejected states
    sendPromise.then(
        function(data) {
        // console.log(data.MessageId);
        return res.status(200).json({
            error: false,
            info: `Mensaje ${data.MessageId} enviado con éxito.`,
            data: ''
        });
    }).catch(
        function(err) {
        console.error(err, err.stack);
        return res.status(200).json({
            error: true,
            info: 'No se ha podido enviar el correo.',
            data: ''
        });
    });
}

module.exports = {getEmails, getEmail, deleteEmail, responderEmail};