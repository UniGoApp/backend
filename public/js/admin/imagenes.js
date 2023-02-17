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
.catch(error => {
    uniMSG.textContent = "Error al cargar las imagenes.";
});

// Avatares usuarios
const userMSG = document.querySelector('#imagenes-usuarios > p');
const userImgContainer = document.querySelector('#imagenes-usuarios > div');
fetch('/user-imgs', requestOptions)
.then(response => response.json())
.then(result => {
    console.log('result :>> ', result);
    if(!result.error){
        for(let i=0; i<result.data.length; i++){
            userImgContainer.innerHTML += `<div><img src="./img/users/${result.data[i].picture}" alt="usuario ${result.data[i].id}" /><p>${result.data[i].id}</p></div>`;
        }
    }else{
        userMSG.textContent = result.info;
    }
})
.catch(error => {
    userMSG.textContent = "Error al cargar las imagenes.";
});