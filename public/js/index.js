const nav = document.getElementById('menu');
const buttonNav = document.getElementById('toggle-nav');

//Closing menu from icon
buttonNav.onclick = () => {
    buttonNav.classList.toggle('is-active');
}
//Closing menu from anchor
for(let i=0; i<nav.children.length; i++){
    nav.children[i].onclick = () => {
        buttonNav.classList.toggle('is-active');
    }
}
