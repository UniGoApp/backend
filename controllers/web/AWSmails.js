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


module.exports = {getEmails, getEmail, deleteEmail};