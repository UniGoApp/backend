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
        let sectionToShow = document.getElementById(menuNameArchivos+'-'+e.target.innerText.split('.')[0]);
        let allSections = sectionToShow.parentNode.getElementsByTagName('section');
        for(let j=0;j<allSections.length; j++){
            allSections[j].style.display='none';
        }
        sectionToShow.style.display='block';
    };
}
// TEXTAREA CHECK PARSING
let textareas = document.querySelectorAll('#archivos > div > section > form > textarea');
for(let i=0; i<textareas.length; i++){
    textareas[i].addEventListener('input', ()=>{
        try{
            JSON.parse(textareas[i].value);
            textareas[i].style.backgroundColor = "#cbcbcb";
        }catch(err){
            textareas[i].style.backgroundColor = "tomato";
        }
    });
}

// LOGIN FAILURE
let textarea_loginFailure = document.getElementById('loginFailure_json');
let loginFailure_txt = '';
fetch('/admin/logins', requestOptions)
.then(response => response.json())
.then(result => {
    if(result.error){
        textarea_loginFailure.value = result.info;
        document.getElementById('descartar-loginFailure').style.display = "none";
        document.getElementById('guardar-loginFailure').style.display = "none";
    }else{
        let original_loginFailure_json = JSON.stringify(result.data, null, 2);
        loginFailure_txt = original_loginFailure_json;
        textarea_loginFailure.value = original_loginFailure_json;
    }
})
.catch(error => {
    textarea_loginFailure.value = "Error al cargar los datos de login.";
    document.getElementById('descartar-loginFailure').style.display = "none";
    document.getElementById('guardar-loginFailure').style.display = "none";
});


const descartarLoginFailure = document.getElementById('descartar-loginFailure');
const guardarLoginFailure = document.getElementById('guardar-loginFailure');
textarea_loginFailure.addEventListener('input', function(){
    if(textarea_loginFailure.value !== loginFailure_txt){
        descartarLoginFailure.classList.remove('disabled');
        guardarLoginFailure.classList.remove('disabled');
        descartarLoginFailure.addEventListener('click', descartar_loginFailure);
        guardarLoginFailure.addEventListener('click', guardar_loginFailure);
    }else{
        descartarLoginFailure.classList.add('disabled');
        guardarLoginFailure.classList.add('disabled');
        descartarLoginFailure.removeEventListener('click', descartar_loginFailure);
        guardarLoginFailure.removeEventListener('click', guardar_loginFailure);
    }
});
function descartar_loginFailure(){
    textarea_loginFailure.value = loginFailure_txt;
    descartarLoginFailure.classList.add('disabled');
    guardarLoginFailure.classList.add('disabled');
    descartarLoginFailure.removeEventListener('click', descartar_loginFailure);
    guardarLoginFailure.removeEventListener('click', guardar_loginFailure);
}
function guardar_loginFailure(){
    let raw = textarea_loginFailure.value;
    let requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch('/admin/logins', requestOptions)
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

    descartarLoginFailure.classList.add('disabled');
    guardarLoginFailure.classList.add('disabled');
    descartarLoginFailure.removeEventListener('click', descartar_loginFailure);
    guardarLoginFailure.removeEventListener('click', guardar_loginFailure);
}

// NEWSLETTER
let textarea_newsletter = document.getElementById('newsletter_json');
let newsletter_txt = '';
fetch('/admin/newsletter', requestOptions)
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
    fetch('/admin/newsletter', requestOptions)
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
