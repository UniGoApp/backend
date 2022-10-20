//////// DASHBOARD ////////
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

let dataUsuarios, dataViajes, dataUniversidades = '';

const fillNewsletterTable = (info) => {
    const headerNewsletter  = document.querySelector('.newsletter > div > aside > table > thead > tr > th');
    const tableNewsletter  = document.querySelector('.newsletter > div > aside > table > tbody');
    tableNewsletter.innerHTML = '';
    if(!info && !info.data){
        const row = document.createElement('tr');
        row.innerText = 'No hay usuarios suscritos todavía.';
        tableNewsletter.appendChild(row);
        headerNewsletter.innerText = '0 usuarios suscritos';
    }else{
        headerNewsletter.innerText = info.data.emails.length+' usuarios suscritos al boletín';
        for(let i = 0; i<info.data.emails.length; i++){
            const row = document.createElement('tr');
            const rowdata = document.createElement('td');
            rowdata.innerText = info.data.emails[i];
            row.appendChild(rowdata);
            tableNewsletter.appendChild(row);
        }
    }
}

const refreshDashboard = () => {
    fetch('/api/admin/usuarios', requestOptions)
    .then(response => response.json())
    .then(result => {
        if(!result.data){
            usuarios.innerText = 0;
        }else{
            usuarios.innerText = result.data.length;
        }
        dataUsuarios = result;
        //Msg target
        const target = document.getElementById('bbdd-usuarios').getElementsByTagName('tab-msg')[0];
        //Data targets
        const thead = document.getElementById('bbdd-usuarios').getElementsByTagName('thead')[0];
        const tbody = document.getElementById('bbdd-usuarios').getElementsByTagName('tbody')[0];
        //Remove previous data:
        thead.innerHTML="";
        tbody.innerHTML="";
        
        if(result.msg){
            target.innerText = result.msg;
            document.querySelector('#bbdd-usuarios > table').style.display = 'none';
        }else{
            //Table headings
            const trhead = document.createElement('tr');
            const keys = Object.keys(result.data[0]);
            keys.forEach(key => {
                if(key !== 'password'){
                    const th = document.createElement('th');
                    th.innerText = key;
                    trhead.appendChild(th);
                }
            });
            thead.appendChild(trhead);

            //Table content
            result.data.forEach(user => {
                //DATA
                const trbody = document.createElement('tr');
                for(let d = 0; d < keys.length; d++){
                    if(keys[d] !== 'password'){
                        const td = document.createElement('td');
                        let key = keys[d];
                        td.innerText = user[key];
                        trbody.appendChild(td);
                    }
                }
                tbody.appendChild(trbody);
            });
        }
    })
    .catch(error => console.log('error', error));

    fetch('/api/admin/viajes', requestOptions)
    .then(response => response.json())
    .then(result => {
        if(!result.data){
            viajes.innerText = 0;
        }else{
            viajes.innerText = result.data.length;
        }
        dataViajes = result;
        //Clear previous data:
        document.querySelector('#viajes-cards').innerHTML= '';
        //Get html target
        const target = document.getElementById('bbdd-viajes').getElementsByClassName('tab-msg')[0];

        if(result.msg){
            target.innerText = result.msg;
            document.getElementById('viajes-cards').style.display = 'none';
        }else{
            const section = document.querySelector('#viajes-cards');
            result.data.forEach(info => {
                const div = document.createElement('div');
                const card = document.createElement('details');
                card.classList.add('card');
                card.setAttribute("viaje-id", info.id);

                const summary = document.createElement('summary');
                summary.innerHTML = 'Viaje ' + info.id + ' - <strong>' + info.estado+'</strong>';
                const p_usuario = document.createElement('p');
                p_usuario.innerText = 'ID usuario: ' + info.id_usuario + ` , ${info.username} [${info.email}, ${info.phone}]`;
                card.appendChild(summary);
                card.appendChild(p_usuario);
                const p_salida = document.createElement('p');
                p_salida.innerText = 'Salida: ' + info.salida;
                card.appendChild(p_salida);
                const p_origen_destino = document.createElement('p');
                p_origen_destino.innerText = 'Origen: ' + info.origen + ' | Destino: ' + info.destino;
                card.appendChild(p_origen_destino);
                const p_plazas_precio = document.createElement('p');
                p_plazas_precio.innerHTML = 'Plazas (ocupadas/totales): ' + info.plazas + '/' + info.totales + ' | <strong>Precio: '+info.precio+'€ </strong>';
                card.appendChild(p_plazas_precio);
                const p_observaciones = document.createElement('p');
                p_observaciones.innerText = 'Observaciones: ' + info.observaciones;
                card.appendChild(p_observaciones);
                // const pasajeros = document.createElement('p');
                // pasajeros.innerHTML = 'Pasajeros: ';
                // card.appendChild(pasajeros);
                // const pasajeros_list = document.createElement('ul');
                // for(let i=0; i<info.id_pasajerospasajeros.length; i++){
                //     const pas = `<li>${info.id_pasajeros[i]}</li>`;
                //     pasajeros_list.appendChild(pas);
                // }
                // card.appendChild(pasajeros_list);
                section.appendChild(card);
            });
        }
    })
    .catch(error => console.log('error', error));

    fetch('/api/admin/reservas', requestOptions)
    .then(response => response.json())
    .then(result => {
        //Msg target
        const tabmsg = document.getElementById('bbdd-reservas').getElementsByTagName('tab-msg')[0];
        //Data targets
        const thead = document.getElementById('bbdd-reservas').getElementsByTagName('thead')[0];
        const tbody = document.getElementById('bbdd-reservas').getElementsByTagName('tbody')[0];
        //Remove previous data:
        thead.innerHTML="";
        tbody.innerHTML="";
        
        if(result.msg){
            tabmsg.innerText = dataUsuarios.msg;
            document.querySelector('#bbdd-reservas > table').style.display = 'none';
        }else{
            //Table headings
            const trhead = document.createElement('tr');
            const keys = Object.keys(result.data[0]);
            keys.forEach( key => {
                const th = document.createElement('th');
                th.innerText = key;
                trhead.appendChild(th);
            });
            thead.appendChild(trhead);

            //Table content
            result.data.forEach(msg => {
                //DATA
                const trbody = document.createElement('tr');
                for(let d = 0; d < keys.length; d++){
                    const td = document.createElement('td');
                    let key = keys[d];
                    td.innerText = msg[key];
                    trbody.appendChild(td);
                }
                tbody.appendChild(trbody);
            });
        }
    })
    .catch(error => console.log('error', error));

    fetch('/api/admin/mensajes', requestOptions)
    .then(response => response.json())
    .then(result => {
        if(!result.data){
            mensajes.innerText = 0;
        }else{
            mensajes.innerText = result.data.length;
        }
        //Msg target
        const tabmsg = document.getElementById('bbdd-mensajes').getElementsByTagName('tab-msg')[0];
        //Data targets
        const thead = document.getElementById('bbdd-mensajes').getElementsByTagName('thead')[0];
        const tbody = document.getElementById('bbdd-mensajes').getElementsByTagName('tbody')[0];
        //Remove previous data:
        thead.innerHTML="";
        tbody.innerHTML="";
        
        if(result.msg){
            tabmsg.innerText = dataUsuarios.msg;
            document.querySelector('#bbdd-mensajes > table').style.display = 'none';
        }else{
            //Table headings
            const trhead = document.createElement('tr');
            const keys = Object.keys(result.data[0]);
            keys.forEach( key => {
                const th = document.createElement('th');
                th.innerText = key;
                trhead.appendChild(th);
            });
            thead.appendChild(trhead);

            //Table content
            result.data.forEach(msg => {
                //DATA
                const trbody = document.createElement('tr');
                for(let d = 0; d < keys.length; d++){
                    const td = document.createElement('td');
                    let key = keys[d];
                    td.innerText = msg[key];
                    trbody.appendChild(td);
                }
                tbody.appendChild(trbody);
            });
        }
    })
    .catch(error => console.log('error', error));
};

refreshDashboard();