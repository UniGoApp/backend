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
        noti.querySelector('p').innerText = error;
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
        result.data.comunidades.forEach(com => {
            uniscount += com.universidades.length;
        });
        universidades.innerText = uniscount;
        original_destinos_json = JSON.stringify(result.data, null, 4);
        destinos_txt = original_destinos_json;
        mostrarImagenes();
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
            noti.querySelector('p').innerText = error;
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
function mostrarImagenes(){
    const imagenesContainer = document.querySelector('#imagenes-universidades > div');
    if(!destinos_txt){
        imagenesContainer.innerText = "Error al cargar los escudos.";
    }else{
        imagenesContainer.innerHTML="";
        const escudosUnisJSON = JSON.parse(destinos_txt);
        escudosUnisJSON.comunidades.forEach(com => {
            com.universidades.forEach(uni => {
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
    }
}

