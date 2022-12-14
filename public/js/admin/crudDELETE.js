//DELETE METHODS and FORMS
const showDeleteForm = (e) => {
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
    const modal = document.getElementById('modalDelete');
    modal.classList.add('modal-opened');
    modal.querySelector('h4').innerText = '';
    modal.querySelector('p').innerText = '';
    const body = modal.querySelector('section.modal-container-body > div');
    body.innerHTML = '';

    switch (tabName) {
        case 'reservas':
            modal.querySelector('h4').innerText = "Reserva:";
            let data_reserva = {};
            const info_reserva = target.getElementsByTagName('td');
            data_reserva.id = info_reserva[0].innerText;
            data_reserva.id_usuario = info_reserva[1].innerText;
            data_reserva.id_viaje = info_reserva[2].innerText;
            data_reserva.leido = info_reserva[3].innerText;
            modal.querySelector('p').innerText = JSON.stringify(data_reserva, null, '\t');
            break;
        case 'usuarios':
            modal.querySelector('h4').innerText = "Usuario: ";
            let data_user = {};
            const info_usuario = target.getElementsByTagName('td');
            data_user.id = info_usuario[0].innerText;
            data_user.email = info_usuario[1].innerText;
            data_user.username = info_usuario[2].innerText;
            data_user.rol = info_usuario[3].innerText;
            data_user.phone = info_usuario[4].innerText;
            modal.querySelector('p').innerText = JSON.stringify(data_user, null, '\t');
            break;
        case 'viajes':
            modal.querySelector('h4').innerText = "Viaje: ";
            
            let data_viaje = {};
            //Estado
            const select_estado = document.createElement('select');
            select_estado.style.width = '100%';
            select_estado.style.marginBottom = '10px';
            const opt_estado_def = document.createElement('option');
            opt_estado_def.innerText = 'Estado del viaje';
            opt_estado_def.disabled = true;
            opt_estado_def.defaultSelected = true;
            select_estado.appendChild(opt_estado_def);
            const estados = ['ACTIVO', 'EN CRUSO', 'FINALIZADO'];
            for(i=0; i<estados.length; i++){
                const opt_viaje = document.createElement('option');
                opt_viaje.value = estados[i];
                opt_viaje.innerText = estados[i];
                select_estado.appendChild(opt_viaje);
            }
            modal.querySelector('section.modal-container-body > div').appendChild(select_estado);

            const select_viaje = document.createElement('select');
            select_viaje.style.width = '100%';
            select_viaje.style.marginBottom = '10px';
            const opt_viaje_def = document.createElement('option');
            opt_viaje_def.innerText = 'Elija un viaje';
            opt_viaje_def.disabled = true;
            opt_viaje_def.defaultSelected = true;
            select_viaje.appendChild(opt_viaje_def);

            select_estado.onchange = () => {
                select_viaje.innerHTML = '';
                modal.querySelector('p').innerText = '';
                const opt_def_v = document.createElement('option');
                opt_def_v.selected = true;
                opt_def_v.disabled = true;
                opt_def_v.innerText = 'Elija un viaje';
                select_viaje.appendChild(opt_def_v);
                let num_viajes = dataViajes.data.length;
                for(i=0; i<num_viajes; i++){
                    if(dataViajes.data[i].estado == select_estado.value){
                        const opt_v = document.createElement('option');
                        opt_v.value = i;
                        opt_v.innerText = 'Viaje '+dataViajes.data[i].id+', usuario: '+ dataViajes.data[i].id_usuario;
                        select_viaje.appendChild(opt_v);
                    }
                }
            }
            modal.querySelector('section.modal-container-body > div').appendChild(select_viaje);
            select_viaje.onchange = () => {
                data_viaje = dataViajes.data[select_viaje.value];
                modal.querySelector('p').innerText = JSON.stringify(data_viaje, null, '\t');
            };
            break;
        default:
            break;
    }
};

const deleteData = (e) => {
    const raw_data = e.parentNode.parentNode.parentNode.querySelector('.modal-container-body > p').innerText;
    if(raw_data == '') return;
    const data = JSON.parse(raw_data);
    // Url en funcion del h4
    let modal_id = document.querySelector('#modalDelete h4').innerText.toLowerCase().split(':')[0]+'s';
    
    const url = `/api/admin/${modal_id}/${data.id}`;
    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
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
    })
    .finally(()=>{
        //refrescar los datos
        switch (modal_id) {
            case 'usuarios':
                // Delete row
                break;
            case 'viajes':
                // Delete card
                break;
            case 'reservas':
                // Delete row
                break;
            default:
                location.reload();
                break;
        }
    });
};
