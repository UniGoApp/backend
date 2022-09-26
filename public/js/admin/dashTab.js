const summary = document.getElementsByClassName('summary')[0];
const usuarios = summary.children[0].getElementsByTagName('span')[0];
const universidades = summary.children[1].getElementsByTagName('span')[0];
const viajes = summary.children[2].getElementsByTagName('span')[0];
const mensajes = summary.children[3].getElementsByTagName('span')[0];

const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    credentials: "same-origin"
};

let dataUsuarios, dataComunidades, dataUniversidades, dataCampus, dataViajes, dataMensajes = '';

const fillNewsletterTable = (info) => {
    const tableNewsletter  = document.querySelector('.newsletter > div > aside > table > tbody');
    tableNewsletter.innerHTML = '';
    if(!info && !info.data){
        const row = document.createElement('tr');
        row.innerText = 'No hay usuarios suscritos todavía.';
        tableNewsletter.appendChild(row)
    }else{
        for(let i = 0; i<info.data.length; i++){
            if(info.data[i].rrss === 'ACTIVE'){
                const row = document.createElement('tr');
                const rowdata = document.createElement('td');
                rowdata.innerText = info.data[i].email;
                row.appendChild(rowdata);
                tableNewsletter.appendChild(row);
            }
        }
    }
}

const refreshDashboard = () => {
    fetch('http://localhost:8000/api/admin/usuarios', requestOptions)
    .then(response => response.json())
    .then(result => {
        if(!result.data){
            usuarios.innerText = 0;
        }else{
            usuarios.innerText = result.data.length;
        }
        dataUsuarios = result;
    })
    .catch(error => console.log('error', error))
    .finally(() => {
        fillNewsletterTable(dataUsuarios);
    });

    fetch('http://localhost:8000/api/admin/comunidades', requestOptions)
    .then(response => response.json())
    .then(result => dataComunidades = result)
    .catch(error => console.log('error', error));

    fetch('http://localhost:8000/api/admin/universidades', requestOptions)
    .then(response => response.json())
    .then(result => {
        if(!result.data){
            universidades.innerText = 0;
        }else{
            universidades.innerText = result.data.length;
        }
        dataUniversidades = result;
    })
    .catch(error => console.log('error', error));

    fetch('http://localhost:8000/api/admin/campus', requestOptions)
    .then(response => response.json())
    .then(result => dataCampus = result)
    .catch(error => console.log('error', error));

    fetch('http://localhost:8000/api/admin/viajes', requestOptions)
    .then(response => response.json())
    .then(result => {
        if(!result.data){
            viajes.innerText = 0;
        }else{
            viajes.innerText = result.data.length;
        }
        dataViajes = result;
    })
    .catch(error => console.log('error', error));

    fetch('http://localhost:8000/api/admin/mensajes', requestOptions)
    .then(response => response.json())
    .then(result => {
        if(!result.data){
            mensajes.innerText = 0;
        }else{
            mensajes.innerText = result.data.length;
        }
        dataMensajes = result;
    })
    .catch(error => console.log('error', error));
};

refreshDashboard();

const sendNewsletter = (e) => {
    const asunto = document.querySelector('.newsletter > div > article > input');
    const cuerpo = document.querySelector('.newsletter > div > article > textarea');
    console.log(`newsletter. asunto: ${asunto.value}, cuerpo ${cuerpo.value}`);
    //finally
    asunto.value = '';
    cuerpo.value = '';
    //mostrar notificacion
}