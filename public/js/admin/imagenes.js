// tabs controller
const menuNameImagenes = 'imagenes';
const menuImagenes = document.getElementById(menuNameImagenes+'-menu');
const enlaces_menu_imagenes = menuImagenes.getElementsByTagName('p');
for(let i=0;i<enlaces_menu_imagenes.length; i++){
    enlaces_menu_imagenes[i].onclick = (e) => {
        for(let j=0;j<enlaces_menu_imagenes.length; j++){
            enlaces_menu_imagenes[j].classList.remove('shown');
        }
        e.target.classList.add('shown');
        let sectionToShow = document.getElementById(menuNameImagenes+'-'+e.target.innerText.toLowerCase());
        let allSections = sectionToShow.parentNode.getElementsByTagName('section');
        for(let j=0;j<allSections.length; j++){
            allSections[j].style.display='none';
        }
        sectionToShow.style.display='block';
    };
}

// Escudos universidades
const uniMSG = document.querySelector('#imagenes-universidades > p');
const uniImgContainer = document.querySelector('#imagenes-universidades > div');
fetch('/admin/uni-imgs', requestOptions)
.then(response => response.json())
.then(result => {
    if(!result.error){
        for(let i=0; i<result.data.length; i++){
            uniImgContainer.innerHTML += `<div><img src="./img/universidades/${result.data[i].icon}" alt="escudo ${result.data[i].icon.split('.')[0]}" /><p>${result.data[i].icon}</p></div>`;
        }
    }else{
        uniMSG.textContent = result.info;
    }
})
.catch(err => {
    uniMSG.textContent = "Error al cargar las imagenes.";
});

// Avatares usuarios
const userMSG = document.querySelector('#imagenes-usuarios > p');
const userImgContainer = document.querySelector('#imagenes-usuarios > div');
fetch('/admin/user-imgs', requestOptions)
.then(response => response.json())
.then(result => {
    if(!result.error){
        for(let i=0; i<result.data.length; i++){
            const div = document.createElement('div');
            const img = document.createElement('img');
            img.src = `./img/users/${result.data[i].picture}`;
            img.alt = `imagen de usuario ${result.data[i].id}`;
            const p = document.createElement('p');
            p.textContent = `Usuario: ${result.data[i].id}`;
            const button = document.createElement('button');
            button.addEventListener('click', borrarImagenUsuario);
            button.textContent = 'Borrar imagen';
            div.appendChild(img);
            div.appendChild(p);
            result.data[i].picture !== 'user_default.png' && div.appendChild(button);
            userImgContainer.appendChild(div);
        }
    }else{
        userMSG.textContent = result.info;
    }
})
.catch(err => {
    console.log('err :>> ', err);
    userMSG.textContent = "Error al cargar las imagenes.";
}).finally( () => {
    // Click event for users and unis
    const imgs = document.querySelectorAll('#imagenes > div > section img');
    for (let i = 0; i < imgs.length; i++) {
        imgs[i].addEventListener('click', (e) => {
            const url = e.target.src;
            document.getElementById('imageViewer').style.display='flex';
            document.querySelector('#imageViewer > img').src=url;
            document.querySelector('#imageViewer > img').alt='Imagen de usuario';
            document.querySelector('#imageViewer > p').textContent='Subdirectorio de la imagen: /img'+url.split('img')[1];
        });
    }
});

const closeImageViewer = (e) => {
    e.parentNode.style.display = 'none';
    e.parentNode.getElementsByTagName('img')[0].src='';
    e.parentNode.getElementsByTagName('img')[0].alt='';
};

const borrarImagenUsuario = (e) =>{
    const id_user = e.target.parentNode.getElementsByTagName('p')[0].textContent.split(': ')[1];
    const user_image = e.target.parentNode.getElementsByTagName('img')[0];
    const old_image = user_image.src.split('/users/')[1];
    const new_image = './img/users/user_default.png';
    if (window.confirm("¿Está seguro de borrar la imagen?")) {
        fetch(`/admin/usuarios_img/${id_user}`, {
            method: 'PUT',
            headers: myHeaders,
            credentials: "same-origin",
            body: JSON.stringify({old_image})
        })
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
                // Update img
                user_image.src=new_image;
                e.target.style.display="none";
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
    }
};