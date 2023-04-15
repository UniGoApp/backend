//PUT METHODS and FORMS
const showPutForm = (e) => {
    let [target, tab] = '';
    if(e.nodeName == 'DIV') {
        target = e.parentNode.parentNode;
        tab = e.parentNode.parentNode.parentNode.parentNode.parentNode.id;
    }else if(e.nodeName == 'SPAN'){
        tab = e.parentNode.parentNode.id;
    }else{
        return;
    }
    const tabName = tab.split('-')[1].toLowerCase();
    const modal = document.getElementById('modalPut');
    modal.classList.add('modal-opened');
    modal.querySelector('h4').innerText = '';
    modal.querySelector('p').innerText = '';
    const body = modal.querySelector('section.modal-container-body > div');
    body.innerHTML = '';

    switch (tabName) {
        case 'usuarios':
            modal.querySelector('h4').innerText = "Usuario: ";
            let data_user = {id:'', email:'', username:'', rol:'', phone:'', picture:'', reset_code:'', creation_time:'', rrss:''};
            const elements = target.getElementsByTagName('TD');
            data_user.id = elements[0].innerText;
            data_user.email = elements[1].innerText;
            data_user.username = elements[2].innerText;
            data_user.rol = elements[3].innerText;
            data_user.phone = elements[4].innerText;
            data_user.picture = elements[5].innerText;
            data_user.reset_code = elements[6].innerText;
            data_user.creation_time = elements[7].innerText;
            data_user.rrss = elements[8].innerText;
            modal.querySelector('p').innerText = JSON.stringify(data_user, null, '\t');
            break;
        case 'viajes':
            modal.querySelector('p').contentEditable = false;
            modal.querySelector('h4').innerText = "Viaje: ";
            let data_viaje = {};

            const select_viaje = document.createElement('select');
            select_viaje.style.width = '100%';
            select_viaje.style.marginBottom = '10px';
            const opt_viaje_def = document.createElement('option');
            opt_viaje_def.innerText = 'Elija un viaje';
            opt_viaje_def.disabled = true;
            opt_viaje_def.defaultSelected = true;
            select_viaje.appendChild(opt_viaje_def);

            let num_viajes = dataViajes.data.length;
            for(i=0; i<num_viajes; i++){
                const opt_v = document.createElement('option');
                opt_v.value = i;
                opt_v.innerText = 'Viaje '+dataViajes.data[i].id+', usuario: '+ dataViajes.data[i].id_usuario;
                select_viaje.appendChild(opt_v);
            }
            modal.querySelector('section.modal-container-body > div').appendChild(select_viaje);
            select_viaje.onchange = () => {
                data_viaje = dataViajes.data[select_viaje.value];
                modal.querySelector('p').innerText = JSON.stringify(data_viaje, null, '\t');
            };
            // observaciones
            const observaciones = document.createElement('textarea');
            observaciones.maxLength = 255;
            observaciones.minLength = 5;
            observaciones.name = 'observaciones';
            observaciones.placeholder = 'Observaciones';
            observaciones.required = false;
            observaciones.spellcheck = true;
            observaciones.style.width = '100%';
            observaciones.style.marginBottom = '10px';
            modal.querySelector('section.modal-container-body > div').appendChild(observaciones);
            observaciones.oninput = () => {
                data_viaje.observaciones = observaciones.value;
                modal.querySelector('p').innerText = JSON.stringify(data_viaje, null, '\t');
            }
            // estado
            const select_estado = document.createElement('select');
            select_estado.style.width = '100%';
            select_estado.style.marginBottom = '10px';
            const opt_estado_def = document.createElement('option');
            opt_estado_def.innerText = 'Seleccione un estado';
            opt_estado_def.disabled = true;
            opt_estado_def.defaultSelected = true;
            select_estado.appendChild(opt_estado_def);
            dataEstados = ['ACTIVO', 'EN CURSO', 'FINALIZADO'];
            for(i=0; i<dataEstados.length; i++){
                const opt_estado = document.createElement('option');
                opt_estado.value = dataEstados[i];
                opt_estado.innerText = dataEstados[i];
                select_estado.appendChild(opt_estado);
            }
            modal.querySelector('section.modal-container-body > div').appendChild(select_estado);
            select_estado.onchange = () => {
                data_viaje.estado = select_estado.value;
                modal.querySelector('p').innerText = JSON.stringify(data_viaje, null, '\t');
            };
            break;
        default:
            break;
    }
};

const putData = (e) => {
    const raw_data = e.parentNode.parentNode.parentNode.querySelector('.modal-container-body > p').innerText;
    if(raw_data == '') return;
    const data = JSON.parse(raw_data);
    let modal_id = document.querySelector('#modalPut h4').innerText.toLowerCase().split(':')[0]+'s';
    
    const url = `/${modal_id}/${data.id}`;
    var raw = JSON.stringify(data);
    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => {
        //cerrar modal
        closeModal(e);
        //mostrar notificacion
        if(result.error){
            const noti = document.querySelector('#notifications-wrapper > .notification-error');
            noti.style.display = 'flex';
            noti.querySelector('p').innerText = result.info;
            setTimeout(() => {
                noti.style.display = 'none';
            }, 5000);
        }else{
            // Update row

            // Show notification 
            const noti = document.querySelector('#notifications-wrapper > .notification-success');
            noti.style.display = 'flex';
            noti.querySelector('p').innerText = result.info;
            setTimeout(() => {
                noti.style.display = 'none';
            }, 5000);
        }
    })
    .catch(error => {
        const noti = document.querySelector('#notifications-wrapper > .notification-error');
        noti.style.display = 'flex';
        noti.querySelector('p').innerText = error;
        setTimeout(() => {
            noti.style.display = 'none';
        }, 5000);
    });
};
