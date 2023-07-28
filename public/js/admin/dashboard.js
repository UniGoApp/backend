const summary = document.getElementsByClassName('summary')[0];
const usuarios = summary.children[0].getElementsByTagName('span')[0];
const campus = summary.children[1].getElementsByTagName('span')[0];
const viajes = summary.children[2].getElementsByTagName('span')[0];
const correos = summary.children[3].getElementsByTagName('span')[0];

const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    credentials: "same-origin"
};

let dataUsuarios, dataViajes = '';

const fillNewsletterTable = (info) => {
    const header = document.querySelector('.newsletter > h3');
    const tableNewsletter  = document.querySelector('.newsletter > div > aside > table > tbody');
    tableNewsletter.innerHTML = '';
    if(!info && !info.data){
        const row = document.createElement('tr');
        const rowData = document.createElement('td');
        rowData.innerText = 'Error al cargar los datos.';
        row.appendChild(rowData);
        row.appendChild(rowData);
        tableNewsletter.appendChild(row);
    }else{
        header.innerText += ` (last update: ${new Date(info.data.lastUpdated).toLocaleDateString()})`;
        for(let i = 0; i<info.data.emails.length; i++){
            const row = document.createElement('tr');
            const rowEmail = document.createElement('td');
            rowEmail.innerText = info.data.emails[i].email;
            const rowLast = document.createElement('td');
            rowLast.innerText = new Date(info.data.emails[i].last).toLocaleDateString();
            row.appendChild(rowEmail);
            row.appendChild(rowLast);
            tableNewsletter.appendChild(row);
        }
    }
}

const refreshDashboard = () => {
    fetch('/admin/templates', requestOptions)
    .then(response => response.json())
    .then(result => {
        let targetContainer = document.getElementById('template-email-container');
        targetContainer.innerHTML = '<div class="template template-add" onclick="openModalTemplateAdd()"> <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M22.65 34h3v-8.3H34v-3h-8.35V14h-3v8.7H14v3h8.65ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 23.95q0-4.1 1.575-7.75 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24.05 4q4.1 0 7.75 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Z"/></svg></div>';

        let targetMsg = document.querySelector('#newsletter > p.tab-msg');
        if(result.error){
            targetMsg.textContent = result.info;
        }else{
            const num_plantillas = result.data.TemplatesMetadata.length;
            const plantillas = result.data.TemplatesMetadata;
            
            for(let i=0; i<num_plantillas; i++){
                targetContainer.innerHTML += `<div class="template" onclick="openTemplate(this)"><p>${plantillas[i].Name} <i class="right"></i></p></div>`;
            }
        }
    })
    .catch(error => {
        let targetMsg = document.querySelector('#newsletter > p.tab-msg');
        targetMsg.textContent = "Error al cargar las plantillas de AMAZON.";
    });

    fetch('/admin/usuarios', requestOptions)
    .then(response => response.json())
    .then(result => {
        let target = document.querySelector('#bbdd-usuarios > p.tab-msg');
        if(result.error){
            usuarios.innerText = 0;
            target.textContent = result.info;
            document.querySelector('#bbdd-usuarios > table').style.display = 'none';
            document.getElementById('user-menu').style.display = "none";
        }else{
            usuarios.innerText = result.data.length;
            dataUsuarios = result;
            //Data targets
            const thead = document.getElementById('bbdd-usuarios').getElementsByTagName('thead')[0];
            const tbody = document.getElementById('bbdd-usuarios').getElementsByTagName('tbody')[0];
            //Remove previous data:
            thead.innerHTML="";
            tbody.innerHTML="";
            //Table headings
            const trhead = document.createElement('tr');
            const keys = Object.keys(result.data[0]);
            keys.forEach(key => {
                if(key !== 'password' && key !== 'id'){
                    const th = document.createElement('th');
                    th.innerText = key;
                    trhead.appendChild(th);
                }
            });
            let thActions = document.createElement('th');
            thActions.innerText = "Options";
            trhead.appendChild(thActions);
            thead.appendChild(trhead);
            //Table content
            result.data.forEach(user => {
                //DATA
                const trbody = document.createElement('tr');
                trbody.id = 'usuario-'+user.id;
                for(let d = 0; d < keys.length; d++){
                    if(keys[d] !== 'password' && keys[d] !== 'id'){
                        const td = document.createElement('td');
                        let key = keys[d];
                        td.innerText = user[key];
                        trbody.appendChild(td);
                    }
                }
                const td = document.createElement('td');
                td.innerHTML = `<div onclick="showPutForm(this)"><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725-.7-.7 1.4 1.4Z"/></svg></div><div onclick="showDeleteForm(this)"><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"/></svg></div>`;
                trbody.appendChild(td);
                tbody.appendChild(trbody);
            });
        }
    })
    .catch(error => {
        let target = document.querySelector('#bbdd-usuarios > p.tab-msg');
        target.textContent="Error al cargar los usuarios del servidor.";
        document.getElementById('user-menu').style.display = "none";
    });

    fetch('/admin/emails', requestOptions)
    .then(response => response.json())
    .then(result => {
        //Msg target
        const emailContainer = document.getElementById('correo');
        let tabmsg = emailContainer.getElementsByClassName('tab-msg')[0];
        const target = document.getElementById('email-list');
        //Data targets
        const thead = target.getElementsByTagName('thead')[0];
        const tbody = target.getElementsByTagName('tbody')[0];
        //Remove previous data:
        thead.innerHTML="";
        tbody.innerHTML="";
        if(result.error){
            correos.innerText = 0;
            tabmsg.innerText = result.info;
            emailContainer.querySelector('div').style.display = 'none';
        }else{
            correos.innerText = result.data.length;
            //Table headings
            const trhead = document.createElement('tr');
            const th = document.createElement('th');
            th.innerText = 'Key';
            trhead.appendChild(th);
            thead.appendChild(trhead);

            // Table content
            result.data.forEach( s3obj => {
                const name = s3obj.Key.split('/')[1];

                const trbody = document.createElement('tr');
                const td = document.createElement('td');
                td.innerText = name;
                trbody.appendChild(td);

                trbody.onclick = (e) => {
                    const show = document.getElementById('email-content');
                    let loader = `<div class="boxLoading"><div></div><div></div></div>`;
                    show.innerHTML = loader;
                    let clicked = e.target;
                    if(e.target.nodeName === "TD"){
                        clicked = e.target.parentNode;
                    }
                    clicked.parentNode.querySelectorAll('tr').forEach(e => {
                        e.classList.remove('visible');
                    });
                    clicked.classList.add('visible');
                    //Get email info
                    fetch(`/admin/email/${clicked.innerText}`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        show.innerHTML="";
                        if(result.error){
                            show.innerText = result.info;
                        }
                        const util = result.data.split('MIME-Version: 1.0')[1];
                        const dataBoundary = '--'+util.split('Content-Type: multipart/alternative; boundary="')[1].split('"')[0];
                        let mixedBoundary ='--';
                        util.search('multipart/mixed') != -1 ?
                        (mixedBoundary += util.split('Content-Type: multipart/mixed; boundary="')[1].split('"')[0]) : (mixedBoundary += '');

                        let emailParts = util.split(mixedBoundary);
                        if(mixedBoundary === '--'){
                            emailParts = util.split(dataBoundary);
                            emailParts[1] = '';
                            emailParts[2] = `<b>${emailParts[2].split('Content-Type: text/html; charset="UTF-8"')[1]}</b>`;
                            emailParts[3] = 'Sin archivos adjuntos.';
                        }else{
                            emailParts[1] = `<b>${emailParts[1].split(dataBoundary)[2].split('Content-Type: text/html; charset="UTF-8"')[1]}</b>`;
                            const archivo = emailParts[2].split(/\r?\n/);
                            const largo = emailParts[2].split(/\r?\n/).length;
                            let archivoFinal = '';
                            for(let i =7; i<largo-1;i++){
                                archivoFinal += archivo[i];
                            }
                            emailParts[2] = '';
                            emailParts[3] = `<img src="data:image/jpeg;base64,${archivoFinal}" alt="imagen correo"/>`;
                        }
                        show.innerText += emailParts[0];
                        show.innerHTML += emailParts[1];
                        show.innerHTML += emailParts[2];
                        show.innerHTML += emailParts[3];

                    })
                    .catch(error => {
                        show.textContent = "Error al cargar el correo del servidor.";
                        console.log('error :>> ', error);
                    });
                };
                tbody.appendChild(trbody);
            });
        }
    })
    .catch(error => {
        let target = document.querySelector('#correo > p.tab-msg');
        target.textContent="Error al cargar los correos del servidor.";
        console.log('error :>> ', error);
    });

    fetch('/admin/viajes', requestOptions)
    .then(response => response.json())
    .then(result => {
        const section = document.getElementById('bbdd-viajes');
        //Msg target
        const tabmsg = section.getElementsByClassName('tab-msg')[0];
        //Data targets
        const thead = section.getElementsByTagName('thead')[0];
        const tbody = section.getElementsByTagName('tbody')[0];
        //Remove previous data:
        thead.innerHTML="";
        tbody.innerHTML="";
        if(result.error){
            viajes.innerText = 0;
            tabmsg.innerText = result.info;
            document.querySelector('#bbdd-viajes > table').style.display = 'none';
        }else{
            dataViajes = result;
            viajes.innerText = result.data.length;
            //Table headings
            const trhead = document.createElement('tr');
            const keys = Object.keys(result.data[0]);
            keys.forEach( key => {
                if(key !== 'id'){
                    const th = document.createElement('th');
                    th.innerText = key;
                    trhead.appendChild(th);
                }
            });
            let thActions = document.createElement('th');
            thActions.innerText = "Options";
            trhead.appendChild(thActions);
            thead.appendChild(trhead);
            //Table content
            result.data.forEach(msg => {
                const trbody = document.createElement('tr');
                trbody.id = 'viaje-'+msg.id;
                for(let d = 0; d < keys.length; d++){
                    if(keys[d] !== 'id'){
                        const td = document.createElement('td');
                        let key = keys[d];
                        td.innerText = msg[key];
                        trbody.appendChild(td);
                    }
                }
                const td = document.createElement('td');
                td.innerHTML = `<div onclick="showPutForm(this)"><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725-.7-.7 1.4 1.4Z"></path></svg></div><div onclick="showDeleteForm(this)"><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"/></svg></div>`;
                trbody.appendChild(td);
                tbody.appendChild(trbody);
            });
        }
    })
    .catch(error => {
        let target = document.querySelector('#bbdd-viajes > p.tab-msg');
        target.textContent="Error al cargar los viajes del servidor.";
    });

    fetch('/admin/reservas', requestOptions)
    .then(response => response.json())
    .then(result => {
        const section = document.getElementById('bbdd-reservas');
        //Msg target
        const tabmsg = section.getElementsByClassName('tab-msg')[0];
        //Data targets
        const thead = section.getElementsByTagName('thead')[0];
        const tbody = section.getElementsByTagName('tbody')[0];
        //Remove previous data:
        thead.innerHTML="";
        tbody.innerHTML="";
        if(result.error){
            tabmsg.innerText = result.info;
            document.querySelector('#bbdd-reservas > table').style.display = 'none';
        }else{
            //Table headings
            const trhead = document.createElement('tr');
            const keys = Object.keys(result.data[0]);
            keys.forEach( key => {
                if(key !== 'id'){
                    const th = document.createElement('th');
                    th.innerText = key;
                    trhead.appendChild(th);
                }
            });
            let thActions = document.createElement('th');
            thActions.innerText = "Options";
            trhead.appendChild(thActions);
            thead.appendChild(trhead);
            //Table content
            result.data.forEach(msg => {
                const trbody = document.createElement('tr');
                trbody.id = 'reserva-'+msg.id;
                for(let d = 0; d < keys.length; d++){
                    if(keys[d] !== 'id'){
                        const td = document.createElement('td');
                        let key = keys[d];
                        td.innerText = msg[key];
                        trbody.appendChild(td);
                    }
                }
                const td = document.createElement('td');
                td.innerHTML = `<div onclick="showPutForm(this)"><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725-.7-.7 1.4 1.4Z"></path></svg></div><div onclick="showDeleteForm(this)"><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"/></svg></div>`;
                trbody.appendChild(td);
                tbody.appendChild(trbody);
            });
        }
    })
    .catch(error => {
        let target = document.querySelector('#bbdd-reservas > p.tab-msg');
        target.textContent="Error al cargar las reservas del servidor.";
    });

    fetch('/admin/campus', requestOptions)
    .then(response => response.json())
    .then(result => {
        const section = document.getElementById('bbdd-campus');
        //Msg target
        const tabmsg = section.getElementsByClassName('tab-msg')[0];
        //Data targets
        const thead = section.getElementsByTagName('thead')[0];
        const tbody = section.getElementsByTagName('tbody')[0];
        //Remove previous data:
        thead.innerHTML="";
        tbody.innerHTML="";
        if(result.error){
            campus.innerText = 0;
            tabmsg.innerText = result.info;
            document.querySelector('#bbdd-campus > table').style.display = 'none';
        }else{
            campus.innerText = result.data.length;
            //Table headings
            const trhead = document.createElement('tr');
            const keys = Object.keys(result.data[0]);
            keys.forEach( key => {
                if(key !== 'id'){
                    const th = document.createElement('th');
                    th.innerText = key;
                    trhead.appendChild(th);
                }
            });
            let thActions = document.createElement('th');
            thActions.innerText = "Options";
            trhead.appendChild(thActions);
            thead.appendChild(trhead);
            //Table content
            result.data.forEach(msg => {
                const trbody = document.createElement('tr');
                trbody.id = 'campus-'+msg.id;
                for(let d = 0; d < keys.length; d++){
                    if(keys[d] !== 'id'){
                        const td = document.createElement('td');
                        let key = keys[d];
                        td.innerText = msg[key];
                        trbody.appendChild(td);
                    }
                }
                const td = document.createElement('td');
                td.innerHTML = `<div onclick="showPutForm(this)"><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725-.7-.7 1.4 1.4Z"></path></svg></div><div onclick="showDeleteForm(this)"><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"/></svg></div>`;
                trbody.appendChild(td);
                tbody.appendChild(trbody);
            });
        }
    })
    .catch(error => {
        let target = document.querySelector('#bbdd-campus > p.tab-msg');
        target.textContent="Error al cargar los destinos del servidor.";
    });

    fetch('/admin/reportes', requestOptions)
    .then(response => response.json())
    .then(result => {
        const section = document.getElementById('bbdd-incidencias');
        //Msg target
        const tabmsg = section.getElementsByClassName('tab-msg')[0];
        //Data targets
        const thead = section.getElementsByTagName('thead')[0];
        const tbody = section.getElementsByTagName('tbody')[0];
        //Remove previous data:
        thead.innerHTML="";
        tbody.innerHTML="";
        if(result.error){
            tabmsg.innerText = result.info;
            document.querySelector('#bbdd-incidencias > table').style.display = 'none';
        }else{
            //Table headings
            const trhead = document.createElement('tr');
            const keys = Object.keys(result.data[0]);
            keys.forEach( key => {
                if(key !== 'id'){
                    const th = document.createElement('th');
                    th.innerText = key;
                    trhead.appendChild(th);
                }
            });
            let thActions = document.createElement('th');
            thActions.innerText = "Options";
            trhead.appendChild(thActions);
            thead.appendChild(trhead);
            //Table content
            result.data.forEach(msg => {
                const trbody = document.createElement('tr');
                trbody.id = 'report-'+msg.id;
                for(let d = 0; d < keys.length; d++){
                    if(keys[d] !== 'id'){
                        const td = document.createElement('td');
                        let key = keys[d];
                        td.innerText = msg[key];
                        trbody.appendChild(td);
                    }
                }
                const td = document.createElement('td');
                td.innerHTML = `<div onclick="showDeleteForm(this)"><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"/></svg></div>`;
                trbody.appendChild(td);
                tbody.appendChild(trbody);
            });
        }
    })
    .catch(error => {
        let target = document.querySelector('#bbdd-incidencias > p.tab-msg');
        target.textContent="Error al cargar las incidencias del servidor.";
    });

};

refreshDashboard();