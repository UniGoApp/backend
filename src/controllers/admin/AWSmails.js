const AWS = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

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
    s3.listObjects(bucketParams, (err, data) => {
        if (err) throw new Error('InternalServerError');
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
    });
}

const getEmail = async (req, res) => {
    const id = req.params.id;
    const getParams = {
        Bucket: process.env.AWS_S3_BucketName,
        Key: `Emails/${id}`
    }

    s3.getObject(getParams, (err, data) => {
        if (err) throw new Error('InternalServerError');
        let objectData = data.Body.toString('utf-8');
        return res.status(200).json({
            error: false,
            info: '',
            data: objectData
        });
    });
}

const deleteEmail = async (req, res) => {
    const id = req.params.id;
    const deleteParams = {
        Bucket: process.env.AWS_S3_BucketName,
        Key: `Emails/${id}`
    }

    s3.deleteObject(deleteParams, (err, data) => {
        if (err) throw new Error('InternalServerError');
        return res.status(200).json({
            error: false,
            info: 'Correo borrado con éxito.',
            data: ''
        });
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
    sendPromise.then((data) => {
        return res.status(200).json({
            error: false,
            info: `Mensaje ${data.MessageId} enviado con éxito.`,
            data: ''
        });
    }).catch((err) => {
        throw new Error('InternalServerError');
    });
}

module.exports = {getEmails, getEmail, deleteEmail, responderEmail};