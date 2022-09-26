
const closeModal = (e) => {
    e.parentNode.parentNode.parentNode.parentNode.parentNode.classList.remove('modal-opened');
};

//POST METHODS and FORMS
const showPostForm = (e) => {
    const tabName = e.parentNode.parentNode.getAttribute('id');

    const modal = document.getElementById('modalPost');
    modal.classList.add('modal-opened');
    modal.querySelector('h4').innerText = '';
    modal.querySelector('p').innerText = '';
    modal.querySelector('section.modal-container-body > div').innerHTML = '';

    modal.getElementsByClassName('modal-container-title')[0].innerText = 'Agregando: ' + tabName;
    const body = modal.getElementsByClassName('modal-container-body')[0];
   
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
            const rol = document.createElement('select');
            rol.name = "rol";
            rol.style.width = '49%';
            rol.style.marginRight = '10px';
            let values = [];
            if(user.rol === "ADMIN"){
                values = ["USER", "ADMIN"];
            }else if(user.rol === "SUPER_ADMIN"){
                values = ["USER", "ADMIN", "SUPER_ADMIN"];
            }
            
            for(i=0; i<values.length; i++){
                const opt_rol = document.createElement('option');
                opt_rol.value = values[i];
                opt_rol.innerText = values[i];
                if(i === 0) opt_rol.defaultSelected = true;
                rol.appendChild(opt_rol);
            }
            const phone = document.createElement('input');
            phone.type = "tel";
            phone.placeholder = "Phone";
            phone.style.width = '49%';
            modal.querySelector('section.modal-container-body > div').appendChild(email);
            modal.querySelector('section.modal-container-body > div').appendChild(password);
            modal.querySelector('section.modal-container-body > div').appendChild(username);
            modal.querySelector('section.modal-container-body > div').appendChild(rol);
            modal.querySelector('section.modal-container-body > div').appendChild(phone);

            let data_user = {email: '', password: '', username: '', rol: 'USER', phone: ''};

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
            rol.onchange = () => {
                data_user.rol = rol.value;
                modal.querySelector('p').innerText = JSON.stringify(data_user, null, '\t');
            }

            break;
        case 'universidades':
            modal.querySelector('h4').innerText = "Universidades: ";

            const uni_type = document.createElement('select');
            uni_type.name = "uni_type";
            uni_type.style.width = '100%';
            uni_type.style.marginBottom = '10px';
            const opt_def = document.createElement('option');
            opt_def.innerText = 'Elija una opción';
            opt_def.disabled = true;
            opt_def.defaultSelected = true;
            uni_type.appendChild(opt_def);
            const uni_values = ["COMUNIDADES", "UNIVERSIDADES", "CAMPUS"];
            for(i=0; i<uni_values.length; i++){
                const opt_type = document.createElement('option');
                opt_type.value = uni_values[i];
                opt_type.innerText = uni_values[i];
                uni_type.appendChild(opt_type);
            }
            modal.querySelector('section.modal-container-body > div').appendChild(uni_type);
            const div = document.createElement('div');
            modal.querySelector('section.modal-container-body > div').appendChild(div);

            uni_type.onchange = () => {

                let container = modal.querySelector('section.modal-container-body > div > div');
                container.innerHTML = '';
                modal.querySelector('p').innerText = '';

                switch (uni_type.value) {
                    case 'COMUNIDADES':
                        let data_comunidades = {nombre: ''};

                        const nombre_comunidad = document.createElement('input');
                        nombre_comunidad.type = "text";
                        nombre_comunidad.placeholder = "Comunidad";
                        nombre_comunidad.style.width = '100%';
                        nombre_comunidad.style.marginBottom = '10px';

                        container.appendChild(nombre_comunidad);

                        nombre_comunidad.oninput = () => {
                            data_comunidades.nombre = nombre_comunidad.value;
                            modal.querySelector('p').innerText = JSON.stringify(data_comunidades, null, '\t');
                        }
                        break;
                    case 'UNIVERSIDADES':
                        let data_universidades = {id_comunidad: '', nombre: '', nombre_corto: ''};
                        const select_comunidad = document.createElement('select');
                        const opt_def_com = document.createElement('option');
                        opt_def_com.selected = true;
                        opt_def_com.disabled = true;
                        opt_def_com.innerText = 'Elija una comunidad';
                        select_comunidad.appendChild(opt_def_com);
                        dataComunidades.data.forEach(comunidad => {
                            const opt_com = document.createElement('option');
                            opt_com.value = comunidad.id;
                            opt_com.innerText = comunidad.nombre;
                            select_comunidad.appendChild(opt_com);
                        });
                        select_comunidad.style.width = '100%';
                        select_comunidad.style.marginBottom = '10px';

                        const nombre_universidad = document.createElement('input');
                        nombre_universidad.type = "text";
                        nombre_universidad.placeholder = "Universidad";
                        nombre_universidad.style.width = '49%';
                        nombre_universidad.style.marginRight = '10px';

                        const nombre_universidad_corto = document.createElement('input');
                        nombre_universidad_corto.type = "text";
                        nombre_universidad_corto.placeholder = "Nombre corto (acrónimo)";
                        nombre_universidad_corto.style.width = '49%';

                        container.appendChild(select_comunidad);
                        container.appendChild(nombre_universidad);
                        container.appendChild(nombre_universidad_corto);

                        select_comunidad.onchange = () => {
                            data_universidades.id_comunidad = select_comunidad.value;
                            modal.querySelector('p').innerText = JSON.stringify(data_universidades, null, '\t');
                        }
                        nombre_universidad.oninput = () => {
                            data_universidades.nombre = nombre_universidad.value;
                            modal.querySelector('p').innerText = JSON.stringify(data_universidades, null, '\t');
                        }
                        nombre_universidad_corto.oninput = () => {
                            data_universidades.nombre_corto = nombre_universidad_corto.value;
                            modal.querySelector('p').innerText = JSON.stringify(data_universidades, null, '\t');
                        }
                        break;
                    case 'CAMPUS':
                        
                        let data_campus = {id_universidad: '', nombre: ''};
                        
                        const select_universidad = document.createElement('select');
                        const opt_def_uni = document.createElement('option');
                        opt_def_uni.selected = true;
                        opt_def_uni.disabled = true;
                        opt_def_uni.innerText = 'Elija una universidad';
                        select_universidad.appendChild(opt_def_uni);
                        dataUniversidades.data.forEach(uni => {
                            const opt_com = document.createElement('option');
                            opt_com.value = uni.id;
                            opt_com.innerText = uni.nombre;
                            select_universidad.appendChild(opt_com);
                        });
                        select_universidad.style.width = '100%';
                        select_universidad.style.marginBottom = '10px';

                        const nombre_campus = document.createElement('input');
                        nombre_campus.type = "text";
                        nombre_campus.placeholder = "Campus";
                        nombre_campus.style.width = '100%';

                        container.appendChild(select_universidad);
                        container.appendChild(nombre_campus);

                        select_universidad.onchange = () => {
                            data_campus.id_universidad = select_universidad.value;
                            modal.querySelector('p').innerText = JSON.stringify(data_campus, null, '\t');
                        }

                        nombre_campus.oninput = () => {
                            data_campus.nombre = nombre_campus.value;
                            modal.querySelector('p').innerText = JSON.stringify(data_campus, null, '\t');
                        }
                        break;
                }
            }

            break;
        case 'mensajes':
            modal.querySelector('h4').innerText = "Mensajes: ";
            const asunto = document.createElement('input');
            asunto.type = 'text';
            asunto.maxLength = 255;
            asunto.minLength = 5;
            asunto.name = 'asunto';
            asunto.placeholder = 'Asunto';
            asunto.required = true;
            asunto.style.width = '100%';
            asunto.style.marginBottom = '10px';
            const mensaje = document.createElement('textarea');
            mensaje.maxLength = 255;
            mensaje.minLength = 10;
            mensaje.name = 'mensaje';
            mensaje.placeholder = 'Cuerpo del mensaje';
            mensaje.required = true;
            mensaje.style.width = '100%';
            body.querySelector('div').appendChild(asunto);
            body.querySelector('div').appendChild(document.createElement('br'));
            body.querySelector('div').appendChild(mensaje);

            let data_msg = {asunto: '', mensaje: ''};

            asunto.oninput = () => {
                data_msg.asunto = asunto.value;
                modal.querySelector('p').innerText = JSON.stringify(data_msg, null, '\t');
            }
            mensaje.oninput = () => {
                data_msg.mensaje = mensaje.value;
                modal.querySelector('p').innerText = JSON.stringify(data_msg, null, '\t');
            }
            break;
        case 'viajes':
            modal.querySelector('h4').innerText = "Viajes: ";
            let data_viaje = {id_usuario: '', origen: '', id_campus: '', precio: '2', plazas: '3', salida: '', observaciones: '', estado: 'ACTIVO'};
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
                if(dataUsuarios.data[i].rol == "USER"){
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
            //salida
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
            const select_universidad = document.createElement('select');
            const opt_def_uni = document.createElement('option');
            opt_def_uni.selected = true;
            opt_def_uni.disabled = true;
            opt_def_uni.innerText = 'Elija una universidad';
            select_universidad.appendChild(opt_def_uni);
            dataUniversidades.data.forEach(uni => {
                const opt_com = document.createElement('option');
                opt_com.value = uni.id;
                opt_com.innerText = uni.nombre;
                select_universidad.appendChild(opt_com);
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
                dataCampus.data.forEach(cam => {
                    if(cam.id_universidad == select_universidad.value){
                        const opt_cam = document.createElement('option');
                        opt_cam.value = cam.id;
                        opt_cam.innerText = cam.nombre;
                        select_campus.appendChild(opt_cam);
                    }
                });
            }
            
            modal.querySelector('section.modal-container-body > div').appendChild(select_campus);

            select_campus.onchange = () => {
                data_viaje.id_campus = select_campus.value;
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
        default:
            break;
    }
};

const postData = (e) => {
    const data = JSON.parse(e.parentNode.parentNode.parentNode.querySelector('.modal-container-body > p').innerText);
    //FETCH con la url en funcion del h4
    let modal_id = document.querySelector('#modalPost h4').innerText.toLowerCase().split(':')[0];

    if(modal_id === 'universidades'){
        const select_postUni = document.querySelector('div > select[name="uni_type"]');
        modal_id = select_postUni.value.toLowerCase();
    }

    const url = `http://localhost:8000/api/admin/${modal_id}`;

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
        closeModal(e);
        if(result.msg){
            const noti = document.querySelector('#notifications-wrapper > .notification-error');
            noti.style.display = 'flex';
            noti.querySelector('p').innerText = result.msg;
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
    .catch(error => console.log('error', error))
    .finally( () => {
        //refrescar los datos
        switch (modal_id) {
            case 'usuarios':
                // const container_user = document.querySelector('#usuarios tbody');
                // let newUser = `<tr><td>${result.data[0].id}</td><td>${result.data[0].email}</td><td>${result.data[0].username}</td><td>${result.data[0].rol}</td><td>${result.data[0].phone}</td><td>${result.data[0].picture}</td><td>${result.data[0].resetCode}</td><td>${result.data[0].creation_time}</td><td><i class="edit" onclick="showPutForm(this)"></i><i class="delete" onclick="showDeleteForm(this)"></i></td></tr>`;
                // container_user.innerHTML += newUser;
                refreshUsuarios();
                break;
            case 'comunidades':
            case 'campus':
            case 'universidades':
                refreshUniversidades();
                break;
            case 'viajes':
                refreshViajes();
                break;
            case 'mensajes':
                // const container_msg = document.getElementById('mensajes-cards');
                // let newMsg = `<details card-id="${result.data[0].id}" class="card"><div class="botonera"><span><i class="edit" onclick="showPutForm(this)"></i></span><span><i class="delete" onclick="showDeleteForm(this)"></i></span></div><summary>Mensaje ${result.data[0].id}: ${result.data[0].asunto}</summary><p>${result.data[0].mensaje}</p></details>`;
                // container_msg.innerHTML += newMsg;
                refreshMensajes();
                break;
            default:
                location.reload();
                break;
        }
    });
};

//DELETE METHODS and FORMS
const showDeleteForm = (e) => {
    const tabName = e.parentNode.parentNode.getAttribute('id');
    const modal = document.getElementById('modalDelete');
    modal.classList.add('modal-opened');
    modal.querySelector('h4').innerText = '';
    modal.querySelector('p').innerText = '';
    const body = modal.querySelector('section.modal-container-body > div');
    body.innerHTML = '';

    switch (tabName) {
        case 'usuarios':
            modal.querySelector('h4').innerText = "Usuarios: ";
            
            let data_user = {id: '', email: '', password: '', username: '', rol: '', phone: '', picture: '', resetCode: '', creation_time: ''};

            const select_user = document.createElement('select');
            select_user.style.width = '100%';
            select_user.style.marginBottom = '10px';
            const opt_user_def = document.createElement('option');
            opt_user_def.innerText = 'Usuario: email - phone';
            opt_user_def.disabled = true;
            opt_user_def.defaultSelected = true;
            select_user.appendChild(opt_user_def);
            for(i=0; i<dataUsuarios.data.length; i++){
                if(dataUsuarios.data[i].rol == "USER"){
                    const opt_user = document.createElement('option');
                    opt_user.value = i;
                    opt_user.innerText = dataUsuarios.data[i].email + " - " + dataUsuarios.data[i].phone;
                    select_user.appendChild(opt_user);
                }
            }
            modal.querySelector('section.modal-container-body > div').appendChild(select_user);

            select_user.onchange = () => {
                data_user = dataUsuarios.data[select_user.value];
                modal.querySelector('p').innerText = JSON.stringify(data_user, null, '\t');
            };

            break;
        case 'viajes':
            modal.querySelector('h4').innerText = "Viajes: ";
            
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
                const opt_def_v = document.createElement('option');
                opt_def_v.selected = true;
                opt_def_v.disabled = true;
                opt_def_v.innerText = 'Elija un viaje';
                select_viaje.appendChild(opt_def_v);
                dataViajes.data.forEach(v => {
                    if(v.estado == select_estado.value){
                        
                    }
                });
                for(i=0; i<dataViajes.data.length; i++){
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
        case 'universidades':
            modal.querySelector('h4').innerText = "Universidades: ";

            const uni_type = document.createElement('select');
            uni_type.name = "uni_type";
            uni_type.style.width = '100%';
            uni_type.style.marginBottom = '10px';
            const opt_def = document.createElement('option');
            opt_def.innerText = 'Elija una opción';
            opt_def.disabled = true;
            opt_def.defaultSelected = true;
            uni_type.appendChild(opt_def);
            const uni_values = ["COMUNIDADES", "UNIVERSIDADES", "CAMPUS"];
            for(i=0; i<uni_values.length; i++){
                const opt_type = document.createElement('option');
                opt_type.value = uni_values[i];
                opt_type.innerText = uni_values[i];
                uni_type.appendChild(opt_type);
            }
            modal.querySelector('section.modal-container-body > div').appendChild(uni_type);
            const div_unis = document.createElement('div');
            modal.querySelector('section.modal-container-body > div').appendChild(div_unis);

            uni_type.onchange = () => {

                let container = modal.querySelector('section.modal-container-body > div > div');
                container.innerHTML = '';
                modal.querySelector('p').innerText = '';

                switch (uni_type.value) {
                    case 'COMUNIDADES':
                        let data_comunidades = {id: '', nombre: ''};

                        const select_com = document.createElement('select');
                        select_com.style.width = '100%';
                        select_com.style.marginBottom = '10px';
                        const opt_com_def = document.createElement('option');
                        opt_com_def.innerText = 'Elija una comunidad';
                        opt_com_def.disabled = true;
                        opt_com_def.defaultSelected = true;
                        select_com.appendChild(opt_com_def);
                        for(i=0; i<dataComunidades.data.length; i++){
                            const opt_com = document.createElement('option');
                            opt_com.value = i;
                            opt_com.innerText = dataComunidades.data[i].nombre;
                            select_com.appendChild(opt_com);
                        }
                        container.appendChild(select_com);

                        select_com.onchange = () => {
                            data_comunidades = dataComunidades.data[select_com.value];
                            modal.querySelector('p').innerText = JSON.stringify(data_comunidades, null, '\t');
                        }
                        break;
                    case 'UNIVERSIDADES':
                        let data_universidades = {id: '', id_comunidad: '', nombre: '', nombre_corto: ''};
                        
                        const select_uni = document.createElement('select');
                        select_uni.style.width = '100%';
                        select_uni.style.marginBottom = '10px';
                        const opt_uni_def = document.createElement('option');
                        opt_uni_def.innerText = 'Elija una universidad';
                        opt_uni_def.disabled = true;
                        opt_uni_def.defaultSelected = true;
                        select_uni.appendChild(opt_uni_def);
                        for(i=0; i<dataUniversidades.data.length; i++){
                            const opt_uni = document.createElement('option');
                            opt_uni.value = i;
                            opt_uni.innerText = dataUniversidades.data[i].nombre;
                            select_uni.appendChild(opt_uni);
                        }
                        container.appendChild(select_uni);

                        select_uni.onchange = () => {
                            data_universidades = dataUniversidades.data[select_uni.value];
                            modal.querySelector('p').innerText = JSON.stringify(data_universidades, null, '\t');
                        }
                        break;
                    case 'CAMPUS':
                        
                        let data_campus = {id: '', id_universidad: '', nombre: ''};
                        
                        const select_cam = document.createElement('select');
                        select_cam.style.width = '100%';
                        select_cam.style.marginBottom = '10px';
                        const opt_cam_def = document.createElement('option');
                        opt_cam_def.innerText = 'Elija un campus';
                        opt_cam_def.disabled = true;
                        opt_cam_def.defaultSelected = true;
                        select_cam.appendChild(opt_cam_def);
                        for(i=0; i<dataCampus.data.length; i++){
                            const opt_cam = document.createElement('option');
                            opt_cam.value = i;
                            opt_cam.innerText = dataCampus.data[i].nombre;
                            select_cam.appendChild(opt_cam);
                        }
                        container.appendChild(select_cam);

                        select_cam.onchange = () => {
                            data_campus = dataCampus.data[select_cam.value];
                            modal.querySelector('p').innerText = JSON.stringify(data_campus, null, '\t');
                        }
                        break;
                }
            }

            break;
        case 'mensajes':
            modal.querySelector('h4').innerText = "Mensajes: ";
            
            let data_msg = {id: '', asunto: '', mensaje: '', fecha: ''};

            const select_msg = document.createElement('select');
            select_msg.style.width = '100%';
            select_msg.style.marginBottom = '10px';
            const opt_msg_def = document.createElement('option');
            opt_msg_def.innerText = 'Elija un mensaje';
            opt_msg_def.disabled = true;
            opt_msg_def.defaultSelected = true;
            select_msg.appendChild(opt_msg_def);
            for(i=0; i<dataMensajes.data.length; i++){
                const opt_msg = document.createElement('option');
                opt_msg.value = i;
                opt_msg.innerText = 'Mensaje '+ dataMensajes.data[i].id + " - " + dataMensajes.data[i].asunto;
                select_msg.appendChild(opt_msg);
            }
            modal.querySelector('section.modal-container-body > div').appendChild(select_msg);
            const div_msg = document.createElement('div');
            modal.querySelector('section.modal-container-body > div').appendChild(div_msg);

            select_msg.onchange = () => {
                data_msg = dataMensajes.data[select_msg.value];
                modal.querySelector('p').innerText = JSON.stringify(data_msg, null, '\t');
            };

            break;
        default:
            break;
    }
};

const deleteData = (e) => {
    const data = JSON.parse(e.parentNode.parentNode.parentNode.querySelector('.modal-container-body > p').innerText);
    const deleted_id = data.id;
    //FETCH con la url en funcion del h4
    let modal_id = document.querySelector('#modalDelete h4').innerText.toLowerCase().split(':')[0];
    if(modal_id == "universidades"){
        modal_id = document.querySelector('select[name="uni_type"]').value.toLowerCase();
    }
    const url = `http://localhost:8000/api/admin/${modal_id}`;
    var raw = JSON.stringify({
        "id": deleted_id
    });
    
    var requestOptions = {
        method: 'DELETE',
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
        if(result.msg){
            const noti = document.querySelector('#notifications-wrapper > .notification-error');
            noti.style.display = 'flex';
            noti.querySelector('p').innerText = result.msg;
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
    .catch(error => console.log('error', error))
    .finally(()=>{
        //refrescar los datos
        switch (modal_id) {
            case 'usuarios':
                refreshUsuarios();
                // const container_user = document.querySelector('#usuarios tbody');
                // for(let i=0; i<container_user.children.length; i++){
                //     if(container_user.children[i].children[0].innerText == deleted_id){
                //         container_user.children[i].replaceWith('');
                //     }
                // }
                // break;
            case 'viajes':
                refreshViajes();
                break;
            case 'comunidades':
            case 'campus':
            case 'universidades':
                refreshUniversidades();
                break;
            case 'mensajes':
                refreshMensajes();
                // const container_msg = document.getElementById('mensajes-cards');
                // for(let i=0; i<container_msg.children.length; i++){
                //     if(container_msg.children[i].getAttribute('card-id') == deleted_id){
                //         container_msg.children[i].replaceWith('');
                //     }
                // }
                break;
            default:
                location.reload();
                break;
        }
    });
};

//PUT METHODS and FORMS
const showPutForm = (e) => {
    //Similar al Delete en logica para ver en que seccion estoy
    const modal = document.getElementById('modalPut');
    modal.classList.add('modal-opened');
    modal.querySelector('h4').innerText = '';
    modal.querySelector('p').innerText = '';
    const body = modal.querySelector('section.modal-container-body > div');
    body.innerHTML = '';

    const target_id_table = e.target.parentNode.parentNode.getElementsByTagName('td')[0].innerText;

    modal.querySelector('h4').innerText = "Va a modificar el usuario con id: " + target_id_table;
};

const putData = (e) => {
    console.log('putData');
};

