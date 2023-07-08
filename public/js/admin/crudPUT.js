//PUT METHODS and FORMS
const showPutForm = (e) => {
    let id_row_selected = e.parentNode.parentNode.id;
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
            modal.querySelector('h4').innerText = "Usuario: "+id_row_selected.split('-')[1];
            let data_user = {username:'', email:'', phone:'', role:'', university: '', bio:'', picture:'', reset_code:'', auth_code:'', creation_time:'', rrss:'', email_confirmed:''};
            const elements_user = target.getElementsByTagName('TD');
            data_user.username = elements_user[0].innerText;
            data_user.email = elements_user[1].innerText;
            data_user.phone = elements_user[2].innerText;
            data_user.role = elements_user[3].innerText;
            data_user.university = elements_user[4].innerText;
            data_user.bio = elements_user[5].innerText;
            data_user.picture = elements_user[6].innerText;
            data_user.reset_code = elements_user[7].innerText;
            data_user.auth_code = elements_user[8].innerText;
            data_user.creation_time = elements_user[9].innerText;
            data_user.rrss = elements_user[10].innerText;
            data_user.email_confirmed = elements_user[11].innerText;
            modal.querySelector('p').innerText = JSON.stringify(data_user, null, '\t');
            break;
        case 'viajes':
            modal.querySelector('h4').innerText = "Viaje: "+id_row_selected.split('-')[1];
            let data_viaje = {id_user: "", origin: "", destination: "", price: "", seats: "", creation: "", departure_date: "", departure_time: "", comments: "", status: "", visualizaciones: ""};
            const elements_viaje = target.getElementsByTagName('TD');
            data_viaje.id_user = elements_viaje[0].innerText;
            data_viaje.origin = elements_viaje[1].innerText;
            data_viaje.destination = elements_viaje[2].innerText;
            data_viaje.price = elements_viaje[3].innerText;
            data_viaje.seats = elements_viaje[4].innerText;
            data_viaje.creation = elements_viaje[5].innerText;
            data_viaje.departure_date = elements_viaje[6].innerText;
            data_viaje.departure_time = elements_viaje[7].innerText;
            data_viaje.comments = elements_viaje[8].innerText;
            data_viaje.status = elements_viaje[9].innerText;
            data_viaje.visualizaciones = elements_viaje[10].innerText;
            modal.querySelector('p').innerText = JSON.stringify(data_viaje, null, '\t');
            break;
        case 'reservas':
            modal.querySelector('h4').innerText = "Reserva: "+id_row_selected.split('-')[1];
            let data_reservas = {id_trip: "", id_user: "", num_seats: "", read:"", scored:""};
            const elements_reservas = target.getElementsByTagName('TD');
            data_reservas.id_trip = elements_reservas[0].innerText;
            data_reservas.id_user = elements_reservas[1].innerText;
            data_reservas.num_seats = elements_reservas[2].innerText;
            data_reservas.read = elements_reservas[3].innerText;
            data_reservas.scored = elements_reservas[4].innerText;
            modal.querySelector('p').innerText = JSON.stringify(data_reservas, null, '\t');
            break;
        case 'campus':
            modal.querySelector('h4').innerText = "Campus: "+id_row_selected.split('-')[1];
            let data_campus = {name: "", university: "", region: "", icon:"", banner:"", color: ""};
            const elements_campus = target.getElementsByTagName('TD');
            data_campus.name = elements_campus[0].innerText;
            data_campus.university = elements_campus[1].innerText;
            data_campus.region = elements_campus[2].innerText;
            data_campus.icon = elements_campus[3].innerText;
            data_campus.banner = elements_campus[4].innerText;
            data_campus.color = elements_campus[5].innerText;
            modal.querySelector('p').innerText = JSON.stringify(data_campus, null, '\t');
            break;
        case 'incidencias':
            modal.querySelector('h4').innerText = "Incidencia: "+id_row_selected.split('-')[1];
            let data_incidencias = {from_user: "", to_user: "", motivo: "", info: "", fecha: ""};
            const elements_incidencias = target.getElementsByTagName('TD');
            data_incidencias.from_user = elements_incidencias[0].innerText;
            data_incidencias.to_user = elements_incidencias[1].innerText;
            data_incidencias.motivo = elements_incidencias[2].innerText;
            data_incidencias.info = elements_incidencias[3].innerText;
            data_incidencias.fecha = elements_incidencias[4].innerText;
            modal.querySelector('p').innerText = JSON.stringify(data_incidencias, null, '\t');
            break;
        default:
            break;
    }
};

const putData = (e) => {
    const raw_data = e.parentNode.parentNode.parentNode.querySelector('.modal-container-body > p').innerText;
    if(raw_data == '') return;
    const data = JSON.parse(raw_data);
    const modal_title = document.querySelector('#modalPut h4').innerText.toLowerCase().split(': ');
    let targetAPI = modal_title[0];
    let targetID = modal_title[1];
    targetAPI = targetAPI[targetAPI.length-1]==='s' ? targetAPI : targetAPI+'s';
    
    const url = `/${targetAPI}/${targetID}`;
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
