//POST METHODS and FORMS
const showPostForm = (e) => {

    if(e.nodeName != 'SPAN') return;
    const tab = e.parentNode.parentNode.id;
    const tabName = tab.split('-')[1].toLowerCase();

    const modal = document.getElementById('modalPost');
    modal.classList.add('modal-opened');
    modal.querySelector('h4').innerText = '';
    modal.querySelector('p').innerText = '';

    const body = modal.querySelector('section.modal-container-body > div');
    body.innerHTML = '';
   
    switch (tabName) {
        case 'usuarios':
            modal.querySelector('h4').innerText = "Usuarios: ";
            const email = document.createElement('input');
            email.type = "email";
            email.placeholder = "Email";
            email.style.width = '49%';
            email.style.marginRight = '10px';
            email.style.marginBottom = '10px';
            const password = document.createElement('input');
            password.type = "text";
            password.placeholder = "Password";
            password.style.width = '49%';
            password.style.marginBottom = '10px';
            const username = document.createElement('input');
            username.type = "text";
            username.placeholder = "Username";
            username.style.width = '100%';
            username.style.marginBottom = '10px';
            const role = document.createElement('select');
            role.name = "role";
            role.style.width = '49%';
            role.style.marginRight = '10px';
            let values = [];
            if(user.role === "ADMIN"){
                values = ["USER", "ADMIN"];
            }else if(user.role === "SUPER_ADMIN"){
                values = ["USER", "ADMIN", "SUPER_ADMIN"];
            }
            for(i=0; i<values.length; i++){
                const opt_rol = document.createElement('option');
                opt_rol.value = values[i];
                opt_rol.innerText = 'ROLE: '+values[i];
                if(i === 0) opt_rol.defaultSelected = true;
                role.appendChild(opt_rol);
            }

            const rrss = document.createElement('select');
            rrss.name = "rrss";
            rrss.style.width = '49%';
            rrss.style.marginTop = '10px';
            let values_rrss = ["ACTIVE", "INACTIVE"];
            
            for(i=0; i<values_rrss.length; i++){
                const opt_rrss = document.createElement('option');
                opt_rrss.value = values_rrss[i];
                opt_rrss.innerText = 'RRSS: '+values_rrss[i];
                if(i === 0) opt_rrss.defaultSelected = true;
                rrss.appendChild(opt_rrss);
            }

            const phone = document.createElement('input');
            phone.type = "tel";
            phone.placeholder = "Phone";
            phone.style.width = '49%';
            modal.querySelector('section.modal-container-body > div').appendChild(email);
            modal.querySelector('section.modal-container-body > div').appendChild(password);
            modal.querySelector('section.modal-container-body > div').appendChild(username);
            modal.querySelector('section.modal-container-body > div').appendChild(role);
            modal.querySelector('section.modal-container-body > div').appendChild(phone);
            modal.querySelector('section.modal-container-body > div').appendChild(rrss);

            let data_user = {email: '', password: '', username: '', role: 'USER', phone: '', rrss:'ACTIVE'};

            email.oninput = () => {
                data_user.email = email.value;
                modal.querySelector('p').innerText = JSON.stringify(data_user, null, '\t');
            }
            password.oninput = () => {
                data_user.password = password.value;
                modal.querySelector('p').innerText = JSON.stringify(data_user, null, '\t');
            }
            username.oninput = () => {
                data_user.username = username.value;
                modal.querySelector('p').innerText = JSON.stringify(data_user, null, '\t');
            }
            phone.oninput = () => {
                data_user.phone = phone.value;
                modal.querySelector('p').innerText = JSON.stringify(data_user, null, '\t');
            }
            role.onchange = () => {
                data_user.role = role.value;
                modal.querySelector('p').innerText = JSON.stringify(data_user, null, '\t');
            }
            rrss.onchange = () => {
                data_user.rrss = rrss.value;
                modal.querySelector('p').innerText = JSON.stringify(data_user, null, '\t');
            }
            break;
        case 'viajes':
            modal.querySelector('h4').innerText = "Viajes: ";
            let data_viaje = {id_usuario: '', origen: '', destination: '', precio: '2', plazas: '3', salida: '', observaciones: '', estado: 'ACTIVO'};
            //usuario
            const select_user = document.createElement('select');
            select_user.style.width = '100%';
            select_user.style.marginBottom = '10px';
            const opt_user_def = document.createElement('option');
            opt_user_def.innerText = 'Seleccione un conductor';
            opt_user_def.disabled = true;
            opt_user_def.defaultSelected = true;
            select_user.appendChild(opt_user_def);
            for(i=0; i<dataUsuarios.data.length; i++){
                if(dataUsuarios.data[i].role == "USER"){
                    const opt_user = document.createElement('option');
                    opt_user.value = i;
                    opt_user.innerText = dataUsuarios.data[i].email + " - " + dataUsuarios.data[i].phone;
                    select_user.appendChild(opt_user);
                }
            }
            modal.querySelector('section.modal-container-body > div').appendChild(select_user);
            select_user.onchange = () => {
                data_viaje.id_usuario = dataUsuarios.data[select_user.value].id;
                modal.querySelector('p').innerText = JSON.stringify(data_viaje, null, '\t');
            };
            //origen
            const origen = document.createElement('input');
            origen.type = 'text';
            origen.maxLength = 255;
            origen.minLength = 5;
            origen.name = 'origen';
            origen.placeholder = 'Origen';
            origen.required = true;
            origen.style.width = '49%';
            origen.style.marginRight = '10px';
            origen.style.marginBottom = '10px';
            modal.querySelector('section.modal-container-body > div').appendChild(origen);
            origen.oninput = () => {
                data_viaje.origen = origen.value;
                modal.querySelector('p').innerText = JSON.stringify(data_viaje, null, '\t');
            }
            //fecha salida 
            const salida = document.createElement('input');
            salida.type = 'datetime-local';
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            let dateTomorrow = tomorrow.toISOString().split('T')[0];
            dateTomorrow = dateTomorrow+'T00:00';
            try{
                dateTomorrow = dateTomorrow.substr(0, 16);
            }catch (err){
                console.log('err :>> ', err);
                dateTomorrow = dateTomorrow.substring(0, 16);
            }
            salida.min = dateTomorrow;
            salida.name = 'salida';
            salida.required = true;
            salida.style.width = '49%';
            salida.style.marginBottom = '10px';
            modal.querySelector('section.modal-container-body > div').appendChild(salida);
            salida.oninput = () => {
                data_viaje.salida = salida.value.replace('T', ' ');
                modal.querySelector('p').innerText = JSON.stringify(data_viaje, null, '\t');
            }

            //destino -> uni
            const destinos = JSON.parse(destinos_txt);

            const select_universidad = document.createElement('select');
            const opt_def_uni = document.createElement('option');
            opt_def_uni.selected = true;
            opt_def_uni.disabled = true;
            opt_def_uni.innerText = 'Elija una universidad';
            select_universidad.appendChild(opt_def_uni);
            destinos.comunidades.forEach(com => {
                com.universidades.forEach(uni => {
                    const opt_uni = document.createElement('option');
                    opt_uni.value = uni.id;
                    opt_uni.innerText = uni.nombre;
                    select_universidad.appendChild(opt_uni);
                });
            });
            select_universidad.style.width = '49%';
            select_universidad.style.marginRight = '10px';
            select_universidad.style.marginBottom = '10px';

            modal.querySelector('section.modal-container-body > div').appendChild(select_universidad);

            //destino -> campus
            const select_campus = document.createElement('select');
            select_campus.style.width = '49%';
            select_campus.style.marginBottom = '10px';
            const opt_def_cam = document.createElement('option');
            opt_def_cam.selected = true;
            opt_def_cam.disabled = true;
            opt_def_cam.innerText = 'Elija un campus destino';
            select_campus.appendChild(opt_def_cam);

            select_universidad.onchange = () => {
                select_campus.innerHTML = '';
                const opt_def_cam = document.createElement('option');
                opt_def_cam.selected = true;
                opt_def_cam.disabled = true;
                opt_def_cam.innerText = 'Elija un campus destino';
                select_campus.appendChild(opt_def_cam);
                destinos.comunidades.forEach(com => {
                    com.universidades.forEach(uni => {
                        uni.campus.forEach(cam => {

                            if(cam.id_universidad == select_universidad.value){
                                const opt_cam = document.createElement('option');
                                opt_cam.value = cam.id;
                                opt_cam.innerText = cam.nombre;
                                select_campus.appendChild(opt_cam);
                            }
                        });
                    });
                });
            }
            
            modal.querySelector('section.modal-container-body > div').appendChild(select_campus);

            select_campus.onchange = () => {
                data_viaje.destination = select_campus.value;
                modal.querySelector('p').innerText = JSON.stringify(data_viaje, null, '\t');
            }

            //precio
            const precio = document.createElement('input');
            precio.type = 'number';
            precio.maxLength = 1000;
            precio.minLength = 0.00;
            precio.step = 0.1;
            precio.name = 'precio';
            precio.placeholder = 'Precio';
            precio.required = true;
            precio.style.width = '49%';
            precio.style.marginRight = '10px';
            precio.style.marginBottom = '10px';
            modal.querySelector('section.modal-container-body > div').appendChild(precio);
            precio.oninput = () => {
                data_viaje.precio = precio.value;
                modal.querySelector('p').innerText = JSON.stringify(data_viaje, null, '\t');
            }
            //plazas
            const plazas = document.createElement('input');
            plazas.type = 'number';
            plazas.maxLength = 5;
            plazas.minLength = 1;
            plazas.step = 1;
            plazas.name = 'plazas';
            plazas.placeholder = 'Plazas';
            plazas.required = true;
            plazas.style.width = '49%';
            plazas.style.marginBottom = '10px';
            modal.querySelector('section.modal-container-body > div').appendChild(plazas);
            plazas.oninput = () => {
                data_viaje.plazas = plazas.value;
                modal.querySelector('p').innerText = JSON.stringify(data_viaje, null, '\t');
            }
            //observaciones
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
            //estado
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
        case 'campus':
            modal.querySelector('h4').innerText = "Campus: ";
            const campus_name = document.createElement('input');
            campus_name.type = "text";
            campus_name.placeholder = "Campus";
            campus_name.style.width = '100%';
            campus_name.style.marginBottom = '10px';
            const campus_university = document.createElement('input');
            campus_university.type = "text";
            campus_university.placeholder = "University";
            campus_university.style.width = '100%';
            campus_university.style.marginBottom = '10px';
            const campus_region = document.createElement('input');
            campus_region.type = "text";
            campus_region.placeholder = "Region";
            campus_region.style.width = '100%';
            campus_region.style.marginBottom = '10px';
            const campus_icon = document.createElement('input');
            campus_icon.type = "text";
            campus_icon.placeholder = "Icon";
            campus_icon.style.width = '100%';
            campus_icon.style.marginBottom = '10px';

            modal.querySelector('section.modal-container-body > div').appendChild(campus_name);
            modal.querySelector('section.modal-container-body > div').appendChild(campus_university);
            modal.querySelector('section.modal-container-body > div').appendChild(campus_region);
            modal.querySelector('section.modal-container-body > div').appendChild(campus_icon);

            let data_campus = {name: '', university: '', region: '', icon: ''};

            campus_name.oninput = () => {
                data_campus.name = campus_name.value;
                modal.querySelector('p').innerText = JSON.stringify(data_campus, null, '\t');
            }
            campus_university.oninput = () => {
                data_campus.university = campus_university.value;
                modal.querySelector('p').innerText = JSON.stringify(data_campus, null, '\t');
            }
            campus_region.oninput = () => {
                data_campus.region = campus_region.value;
                modal.querySelector('p').innerText = JSON.stringify(data_campus, null, '\t');
            }
            campus_icon.oninput = () => {
                data_campus.icon = campus_icon.value;
                modal.querySelector('p').innerText = JSON.stringify(data_campus, null, 4);
            }
            break;
        default:
            break;
    }
};

const postData = (e) => {
    const data = JSON.parse(e.parentNode.parentNode.parentNode.querySelector('.modal-container-body > p').innerText);
    //FETCH con la url en funcion del h4
    let modal_id = document.querySelector('#modalPost h4').innerText.toLowerCase().split(':')[0];

    const url = `/admin/${modal_id}`;
    var raw = JSON.stringify(data);
    var requestOptions = {
        method: 'POST',
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
            // Delete row

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