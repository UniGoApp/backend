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
fetch('/uni-imgs', requestOptions)
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
fetch('/user-imgs', requestOptions)
.then(response => response.json())
.then(result => {
    if(!result.error){
        for(let i=0; i<result.data.length; i++){
            userImgContainer.innerHTML += `<div><img src="./img/users/${result.data[i].picture}" alt="usuario ${result.data[i].id}" /><p>Usuario: ${result.data[i].id}</p><button onclick="borrarImagenUsuario(this)">Borrar imagen</button></div>`;
        }
    }else{
        userMSG.textContent = result.info;
    }
})
.catch(err => {
    userMSG.textContent = "Error al cargar las imagenes.";
}).finally( () => {
    const imgs = userImgContainer.querySelectorAll('img');
    for (let i = 0; i < imgs.length; i++) {
        imgs[i].addEventListener('click', (e) => {
            const url = e.target.src;
            document.getElementById('imageViewer').style.display='block';
            document.querySelector('#imageViewer > img').src=url;
            document.querySelector('#imageViewer > img').alt='Imagen de usuario';
        });
    }
});

const closeImageViewer = (e) => {
    e.parentNode.style.display = 'none';
    e.parentNode.getElementsByTagName('img')[0].src='';
    e.parentNode.getElementsByTagName('img')[0].alt='';
};

const borrarImagenUsuario = (e) =>{
    const id_user = e.parentNode.getElementsByTagName('p')[0].textContent.split(': ')[1];
    const user_image = e.parentNode.getElementsByTagName('img')[0];
    const old_image = user_image.src.split('/users/')[1];
    const new_image = user_image.src.split('/users/')[0] + '/users/user_default.png';
    if (window.confirm("¿Está seguro de borrar la imagen?")) {
        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            credentials: "same-origin",
            body: JSON.stringify({old_image})
        };
        fetch(`/usuarios_img/${id_user}`, requestOptions)
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