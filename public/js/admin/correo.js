let emailContent = document.getElementById('email-content');
let tbody = document.getElementById('email-list').querySelector('table > tbody');

const borrar = () => {
    if(emailContent.innerText == ""){
        return;
    }
    if (confirm("¿Desea borrar el email?") == true) {
        let email1 = tbody.querySelector('tr.visible');
        let id = emailContent.getElementsByTagName('p')[0].innerText;
        let [name, value] = id.split(': ');

        var raw = JSON.stringify({
            "email_id": value
        });
        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch('/api/admin/email', requestOptions)
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
                emailContent.innerHTML = "";
                email1.style.display = "none";
            }
        }).catch(error => {
            const noti = document.querySelector('#notifications-wrapper > .notification-error');
            noti.style.display = 'flex';
            noti.querySelector('p').innerText = error;
            setTimeout(() => {
                noti.style.display = 'none';
            }, 5000);
        });
    } else {
        return;
    }
};

const responder = () => {
    if(emailContent.innerText == ""){
        return;
    }
    console.log('responder :>> ', emailContent.innerText);
};

const reenviar = () => {
    if(emailContent.innerText == ""){
        return;
    }
    console.log('reenviar :>> ', emailContent.innerText);
};