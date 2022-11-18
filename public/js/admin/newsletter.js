const templateContainer = document.getElementById('template-email-container');
const modalTemplate = document.getElementById('modalTemplate');

const openModalTemplateAdd = () => {
    modalTemplate.classList.add('modal-opened');
}

const template_data = document.getElementById('template-email-data');
// const preview = document.querySelector('#previewTemplate');
// document.querySelector('#templateHTML').addEventListener('input', () =>{
//     preview.innerHTML = document.querySelector('#templateHTML').innerText;
// });

const openTemplate = (e) => {
    fetch(`/api/admin/templates/${e.innerText}`, requestOptions)
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
            template_data.querySelector('#templateName').innerText = result.data.Template.TemplateName;
            template_data.querySelector('#templateSubject').innerText = result.data.Template.SubjectPart;
            template_data.querySelector('#templateText').innerText = result.data.Template.TextPart;
            template_data.querySelector('#templateHTML').innerText = result.data.Template.HtmlPart;
            // preview.innerHTML = result.data.Template.HtmlPart;
            result.data.Template;
            template_data.style.display = "inherit";
            const noti = document.querySelector('#notifications-wrapper > .notification-success');
            noti.style.display = 'flex';
            noti.querySelector('p').innerText = result.info;
            setTimeout(() => {
                noti.style.display = 'none';
            }, 5000);
        }
    }).catch(error =>{
        const noti = document.querySelector('#notifications-wrapper > .notification-error');
        noti.style.display = 'flex';
        noti.querySelector('p').innerText = error;
        setTimeout(() => {
            noti.style.display = 'none';
        }, 5000);
    });
}

const addTemplate = (e) => {
    let data = {
        name: modalTemplate.querySelector('#nombreTemplate').value,
        subject: modalTemplate.querySelector('#asuntoTemplate').value,
        html: modalTemplate.querySelector('#plantillaHTML').value,
        text: modalTemplate.querySelector('#plantillaTEXT').value
    };
    const raw = JSON.stringify(data);
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
      
    fetch('/api/admin/templates', requestOptions)
    .then(response => response.json())
    .then(result => {
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
    }).catch(error =>{
        const noti = document.querySelector('#notifications-wrapper > .notification-error');
        noti.style.display = 'flex';
        noti.querySelector('p').innerText = error;
        setTimeout(() => {
            noti.style.display = 'none';
        }, 5000);
    });
}
