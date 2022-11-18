const AWS = require('aws-sdk');

// Create the parameters for calling listObjects
AWS.config.update({
    accessKeyId: process.env.AWS_S3_accessKeyId,
    secretAccessKey: process.env.AWS_S3_secretAccessKey,
    region: process.env.AWS_REGION
});

const listTemplates = async(req, res) => {
    const params = {
        MaxItems: 10,
        NextToken: ''
    };
    let ses = new AWS.SES({apiVersion: '2010-12-01'}).listTemplates(params).promise();
    ses.then(
        function(data) {
        return res.status(200).json({
            error: false,
            info: '',
            data: data
        });
    }).catch(
        function(err) {
        return res.status(200).json({
            error: true,
            info: 'Error al cargar las plantillas.',
            data: ''
        });
    });
}

const getTemplate = async(req, res) => {
    const params = {
        TemplateName: req.params.name
    };
    let ses = new AWS.SES({apiVersion: '2010-12-01'}).getTemplate(params).promise();
    ses.then(
        function(data) {
        return res.status(200).json({
            error: false,
            info: 'Plantilla cargada con éxito.',
            data: data
        });
    }).catch(
        function(err) {
        return res.status(200).json({
            error: true,
            info: 'Error al cargar la plantilla solicitada.',
            data: ''
        });
    });
}

const postTemplate = async(req,res) => {
    const params = {
        Template: { /* required */
            TemplateName: req.body.name, /* required */
            HtmlPart: req.body.html,
            SubjectPart: req.body.subject,
            TextPart: req.body.text
        }
    };
    let ses = new AWS.SES({apiVersion: '2010-12-01'}).createTemplate(params).promise();
    ses.then(
        function(data) {
        return res.status(200).json({
            error: false,
            info: 'Nueva plantilla creada con éxito.',
            data: data
        });
    }).catch(
        function(err) {
            console.log('err :>> ', err.stack);
        return res.status(200).json({
            error: true,
            info: 'Error al publicar la nueva plantilla. Recuerda no usar espacios en el nombre de la plantilla.',
            data: ''
        });
    });
}

const putTemplate = async(req,res) => {

}

const deleteTemplate = async(req,res) => {

}

module.exports = { listTemplates, getTemplate, postTemplate, putTemplate, deleteTemplate };