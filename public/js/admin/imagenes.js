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
