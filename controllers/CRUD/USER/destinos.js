const con = require("../../database");
const jwt = require("jsonwebtoken");

const JWT_SECRET = 'CreacionDeTokensSegurosParaUsuarios_UnicarApp2022';
let destinos = {comunidades: []};
let com = [];
let uni = [];
let cam = [];

function setValue(type, data, res){
    if(type === "comunidades"){
        com = data;
        for(let i=0; i<data.length; i++){
            com[i].universidades = [];
        }
    }else if(type === "universidades"){
        uni = data;
        for(let i=0; i<data.length; i++){
            uni[i].campus = [];
        }
    }else{
        cam = data;
        formarDestinos(res);
    }
}
function formarDestinos(res){
    destinos.comunidades = com;
    for(let i=0; i<com.length; i++){
        for(let j=0; j<uni.length; j++){
            if(destinos.comunidades[i].id === uni[j].id_comunidad){
                destinos.comunidades[i].universidades.push(uni[j]);
                for(let k=0; k<cam.length; k++){
                    if(destinos.comunidades[i].universidades[j].id === cam[k].id_universidad){
                        destinos.comunidades[i].universidades[j].campus.push(cam[k]); 
                    }
                }
            }
        }
    }
    return res.status(200).json(destinos);
}

const obtenerDestinos = async (req, res) => {
    if(req.user._rol === "USER" || req.user._rol === "ADMIN" || req.user._rol === "SUPER_ADMIN"){
        con.execute(
            'SELECT * FROM `comunidades`', (err, result) => {
                if (err) throw err;
                if(result.length === 0) {
                    destinos = {info: 'No hay destinos disponibles', comunidades: 0};
                    return res.status(200).json(destinos);
                }else{
                    setValue("comunidades", result, res);
                }
            }
        );
        con.execute(
            'SELECT * FROM `universidades`', (err, result) => {
                if (err) throw err;
                if(result.length === 0) {
                    destinos = {info: 'No hay destinos disponibles', comunidades: 0};
                    return res.status(200).json(destinos);
                }else{
                    setValue("universidades", result, res);
                }
            }
        );
        con.execute(
            'SELECT * FROM `campus`', (err, result) => {
                if (err) throw err;
                if(result.length === 0) {
                    destinos = {info: 'No hay destinos disponibles', comunidades: 0};
                    return res.status(200).json(destinos);
                }else{
                    setValue("campus", result, res);
                }
            }
        );
    }else{
        return res.status(403).json({
            msg: 'Acceso no autorizado',
            data: '',
            info: ''
        });
    }
};

module.exports = { obtenerDestinos };