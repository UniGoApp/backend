const menuNameBBDD = 'bbdd';
const menuBBDD = document.getElementById(menuNameBBDD+'-menu');
const enlaces_menu_BBDD = menuBBDD.getElementsByTagName('p');
for(let i=0;i<enlaces_menu_BBDD.length; i++){
    enlaces_menu_BBDD[i].onclick = (e) => {
        for(let j=0;j<enlaces_menu_BBDD.length; j++){
            enlaces_menu_BBDD[j].classList.remove('shown');
        }
        e.target.classList.add('shown');
        let sectionToShow = document.getElementById(menuNameBBDD+'-'+e.target.innerText.toLowerCase().split('.')[0]);
        let allSections = sectionToShow.parentNode.getElementsByTagName('section');
        for(let j=0;j<allSections.length; j++){
            allSections[j].style.display='none';
        }
        sectionToShow.style.display='block';
    };
}