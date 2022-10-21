// TABS
const menuNameArchivos = 'archivos';
const menuArchivos = document.getElementById(menuNameArchivos+'-menu');
const enlaces_menu_archivos = menuArchivos.getElementsByTagName('p');
for(let i=0;i<enlaces_menu_archivos.length; i++){
    enlaces_menu_archivos[i].onclick = (e) => {
        for(let j=0;j<enlaces_menu_archivos.length; j++){
            enlaces_menu_archivos[j].classList.remove('shown');
        }
        e.target.classList.add('shown');
        let sectionToShow = document.getElementById(menuNameArchivos+'-'+e.target.innerText.toLowerCase().split('.')[0]);
        let allSections = sectionToShow.parentNode.getElementsByTagName('section');
        for(let j=0;j<allSections.length; j++){
            allSections[j].style.display='none';
        }
        sectionToShow.style.display='block';
    };
}

// NEWSLETTER
let textarea_newsletter = document.getElementById('newsletter_json');
let newsletter_txt = '';
fetch('/api/admin/newsletter', requestOptions)
.then(response => response.json())
.then(result => {
    if(result.error){
        textarea_newsletter.value = result.info;
        document.getElementById('descartar-newsletter').style.display = "none";
        document.getElementById('guardar-newsletter').style.display = "none";
    }else{
        let original_newsletter_json = JSON.stringify(result.data, null, 2);
        newsletter_txt = original_newsletter_json;
        textarea_newsletter.value = original_newsletter_json;
        fillNewsletterTable(result);
    }
})
.catch(error => {
    textarea_newsletter.value = "Error al cargar los datos de newsletter.";
    document.getElementById('descartar-newsletter').style.display = "none";
    document.getElementById('guardar-newsletter').style.display = "none";
});


const descartarNewsletter = document.getElementById('descartar-newsletter');
const guardarNewsletter = document.getElementById('guardar-newsletter');
textarea_newsletter.addEventListener('input', function(){
    if(textarea_newsletter.value !== newsletter_txt){
        descartarNewsletter.classList.remove('disabled');
        guardarNewsletter.classList.remove('disabled');
        descartarNewsletter.addEventListener('click', descartar_newsletter);
        guardarNewsletter.addEventListener('click', guardar_newsletter);
    }else{
        descartarNewsletter.classList.add('disabled');
        guardarNewsletter.classList.add('disabled');
        descartarNewsletter.removeEventListener('click', descartar_newsletter);
        guardarNewsletter.removeEventListener('click', guardar_newsletter);
    }
});
function descartar_newsletter(){
    textarea_newsletter.value = newsletter_txt;
    descartarNewsletter.classList.add('disabled');
    guardarNewsletter.classList.add('disabled');
    descartarNewsletter.removeEventListener('click', descartar_newsletter);
    guardarNewsletter.removeEventListener('click', guardar_newsletter);
}
function guardar_newsletter(){
    let raw = textarea_newsletter.value;
    let requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch('/api/admin/newsletter', requestOptions)
    .then(response => response.json())
    .then(result => {
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
            noti.querySelector('p').innerText = result.info;
            setTimeout(() => {
                noti.style.display = 'none';
            }, 5000);
    });

    descartarNewsletter.classList.add('disabled');
    guardarNewsletter.classList.add('disabled');
    descartarNewsletter.removeEventListener('click', descartar_newsletter);
    guardarNewsletter.removeEventListener('click', guardar_newsletter);
}

// DESTINOS
let textarea_destinos = document.getElementById('destinos_json');
let destinos_txt, original_destinos_json = '';
fetch('/api/destinos', requestOptions)
.then(response => response.json())
.then(result => {
    if(result.error){
        universidades.innerText = 0;
        textarea_destinos.value = result.info;
        document.getElementById('descartar-destinos').style.display = "none";
        document.getElementById('guardar-destinos').style.display = "none";
    }else{
        let uniscount = 0;
        result.data.forEach(com => {
            uniscount += com.universidades.length;
        });
        universidades.innerText = uniscount;
        original_destinos_json = JSON.stringify(result.data, null, 4);
        destinos_txt = original_destinos_json;
        textarea_destinos.value = original_destinos_json;
    }
})
.catch(error => {
    textarea_destinos.value="Error al cargar los datos de destinos.";
    document.getElementById('descartar-destinos').style.display = "none";
    document.getElementById('guardar-destinos').style.display = "none";
});

const descartarDestinos = document.getElementById('descartar-destinos');
const guardarDestinos = document.getElementById('guardar-destinos');
textarea_destinos.addEventListener('input', function(){
    if(textarea_destinos.value !== destinos_txt){
        descartarDestinos.classList.remove('disabled');
        guardarDestinos.classList.remove('disabled');
        descartarDestinos.addEventListener('click', descartar_destinos);
        guardarDestinos.addEventListener('click', guardar_destinos);
    }else{
        descartarDestinos.classList.add('disabled');
        guardarDestinos.classList.add('disabled');
        descartarDestinos.removeEventListener('click', descartar_destinos);
        guardarDestinos.removeEventListener('click', guardar_destinos);
    }
});
function descartar_destinos(){
    textarea_destinos.value = destinos_txt;
    descartarDestinos.classList.add('disabled');
    guardarDestinos.classList.add('disabled');
    descartarDestinos.removeEventListener('click', descartar_destinos);
    guardarDestinos.removeEventListener('click', guardar_destinos);
}
function guardar_destinos(){
    let raw = textarea_destinos.value;
    let requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch('/api/admin/destinos', requestOptions)
    .then(response => response.json())
    .then(result => {
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
            noti.querySelector('p').innerText = result.info;
            setTimeout(() => {
                noti.style.display = 'none';
            }, 5000);
    });

    descartarDestinos.classList.add('disabled');
    guardarDestinos.classList.add('disabled');
    descartarDestinos.removeEventListener('click', descartar_destinos);
    guardarDestinos.removeEventListener('click', guardar_destinos);
}

// IMAGENES DE UNIVERSIDADES EN TAB "IMAGENES"
const imagenesContainer = document.querySelector('#imagenes-universidades > div');
if(!destinos_txt){
    imagenesContainer.innerText = "Error al cargar los escudos.";
}else{
    imagenesContainer.innerHTML="";
    const escudosUnisJSON = JSON.parse(destinos_txt);
    console.log('escudosUnis :>> ', escudosUnisJSON);
    escudosUnisJSON.array.forEach(com => {
        com.universidades.array.forEach(uni => {
    
            let imageCard = document.createElement('div');
            let text = document.createElement('p');
            text.innerText = uni.sigla + ' - ' + com.nombre;
            let image = document.createElement('img');
            image.src = './img/universidades/'+uni.escudo;
            image.alt = 'escudo universidad '+uni.sigla;
            imageCard.appendChild(image);
            imageCard.appendChild(text);
            imagenesContainer.appendChild(imageCard);
        });
    });
    let imageAdd = document.createElement('div');
    imageAdd.classList.add('uni-default');
    imageAdd.onclick = () => {
        //show post form
        console.log('trying to post escudos');
    }
    let text = document.createElement('p');
    text.innerText = 'Añadir nuevo escudo';
    let image = '<svg xmlns="http://www.w3.org/2000/svg" height="120" width="120" fill="#cbcbcb"><path d="M22.65 34h3v-8.3H34v-3h-8.35V14h-3v8.7H14v3h8.65ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 23.95q0-4.1 1.575-7.75 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24.05 4q4.1 0 7.75 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm.05-3q7.05 0 12-4.975T41 23.95q0-7.05-4.95-12T24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24.05 41ZM24 24Z"/></svg>';
    imageAdd.appendChild(image);
    imageAdd.appendChild(text);
    imagenesContainer.appendChild(imageAdd);
}
