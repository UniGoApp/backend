// NAV AND MENU FUNC
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
// GO TO TOP BUTTON FUNC
const goTopButton  = document.getElementById('goTop');
goTopButton.addEventListener('click', function(){
    if(goTopButton.classList.contains('gotop-visible')){
        window.scrollTo(0, 0);
    }
});
window.addEventListener('scroll', function()  {
    if(this.window.scrollY >= window.innerHeight - 200) {
        goTopButton.classList.remove('gotop-invisible');
        goTopButton.classList.add('gotop-visible');
    } else {
        goTopButton.classList.add('gotop-invisible');
        goTopButton.classList.remove('gotop-visible');
    }
});

// // DESTINOS FUNC
let universidadesContainer = document.getElementById('universidades');

fetch('../public_data/destinos.json')
.then(response => response.json())
.then(data => {
    data.comunidades.forEach(com => {
        com.universidades.forEach(uni => {
            let card_uni = `
            <div class="universidad">
                <div class="uni-info">
                    <div class="uni-avatar"><img src="./img/universidades/${uni.escudo}" alt="escudo universidad ${uni.sigla.toLowerCase()}"></div>
                    <div class="uni-title">${uni.sigla}</div>
                    <div class="uni-subtitle">${uni.nombre}</div>
                    <div class="uni-subtitle-2">${uni.campus.length} campus</div>
                </div>
                <div class="uni-community">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 11.75q.725 0 1.238-.512.512-.513.512-1.238t-.512-1.238Q12.725 8.25 12 8.25t-1.238.512q-.512.513-.512 1.238t.512 1.238q.513.512 1.238.512Zm0 10.05q-3.9-3.4-5.825-6.3-1.925-2.9-1.925-5.3 0-3.625 2.338-5.788Q8.925 2.25 12 2.25q3.075 0 5.413 2.162Q19.75 6.575 19.75 10.2q0 2.4-1.925 5.3T12 21.8Z"/></svg>
                    ${com.nombre}
                </div>
            </div>
            `;
            universidadesContainer.innerHTML += card_uni;
        });
    });
    if(universidadesContainer.children.length <= 3){
        const controls = document.querySelector('#destinos > div.controls');
        controls.style.display = "none";
    }
});

// SLIDER CONTROLS
const prevButton = document.querySelector('.controls div.prev');
const nextButton = document.querySelector('.controls div.next');
const allButton = document.querySelector('.controls > button');

prevButton.onclick = () => {
    universidadesContainer.scrollLeft -= 0.33*(0.8*window.innerWidth);
}
nextButton.onclick = () => {
    universidadesContainer.scrollLeft += 0.33*(0.8*window.innerWidth);
}
allButton.onclick = (e) => {
    universidadesContainer.classList.toggle('verTodas');
    if(e.target.innerText === "Mostrar todas"){
        e.target.innerText = "Ver menos";
        prevButton.style.display = "none";
        nextButton.style.display = "none";
        // universidadesContainer.style.flexWrap = "wrap";
        // universidadesContainer.style.overflowX = "unset";
    }else{
        e.target.innerText = "Mostrar todas";
        prevButton.style.display = "inline";
        nextButton.style.display = "inline";
        // universidadesContainer.style.flexWrap = "nowrap";
        // universidadesContainer.style.overflowX = "scroll";
    }
}