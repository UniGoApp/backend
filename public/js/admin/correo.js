let emailContent = document.getElementById('email-content');
let tbody = document.getElementById('email-list').querySelector('table > tbody');

const borrar = () => {
    if(emailContent.innerText == ""){
        return;
    }
    if (confirm("¿Desea borrar el email?") == true) {
        const email = tbody.querySelector('tr.visible');
        let email_id = tbody.querySelector('tr.visible > td').innerText;
        console.log('email_id :>> ', email_id);
        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(`/api/admin/email/${email_id}`, requestOptions)
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
                email.style.display = "none";
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
    let fullContent = emailContent.innerText;
    let fromContent = fullContent.split('From: ')[1];
    let start_of_from = fromContent.split('<')[1];
    let final_from = start_of_from.split('>')[0];
    
    //Open modal to answer email

    
};