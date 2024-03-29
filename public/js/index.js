// NAV AND MENU FUNC
const nav = document.getElementById('menu');
const buttonNav = document.getElementById('toggle-nav');

//Closing menu from icon
buttonNav.onclick = () => {
    buttonNav.classList.toggle('is-active');
}
//Closing menu from anchor
let countChildrens = nav.children.length;
for(let i=0; i<countChildrens; i++){
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

// DESTINOS FUNC
let universidadesContainer = document.getElementById('universidades');

// SLIDER CONTROLS
const prevButton = document.querySelector('.controls div.prev');
const nextButton = document.querySelector('.controls div.next');
const allButton = document.querySelector('.controls > button');

fetch('/web-api/universidades')
.then(response => response.json())
.then(result => {
    if(result.error){
        prevButton.style.display = "none";
        nextButton.style.display = "none";
        allButton.style.display = "none";
        universidadesContainer.innerHTML = result.data;
    }else{
        result.data.map(uni => {
            let card_uni = `
            <div class="universidad">
                <div class="uni-info">
                    <div class="uni-avatar"><img src="./img/universidades/${uni.icon}" alt="escudo universidad ${uni.icon.split('.')[0]}"></div>
                    <div class="uni-title">${uni.icon.split('.')[0].toUpperCase()}</div>
                    <div class="uni-subtitle">${uni.university}</div>
                    <div class="uni-subtitle-2">${uni.numCampus} campus</div>
                </div>
                <div class="uni-community">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 11.75q.725 0 1.238-.512.512-.513.512-1.238t-.512-1.238Q12.725 8.25 12 8.25t-1.238.512q-.512.513-.512 1.238t.512 1.238q.513.512 1.238.512Zm0 10.05q-3.9-3.4-5.825-6.3-1.925-2.9-1.925-5.3 0-3.625 2.338-5.788Q8.925 2.25 12 2.25q3.075 0 5.413 2.162Q19.75 6.575 19.75 10.2q0 2.4-1.925 5.3T12 21.8Z"/></svg>
                    ${uni.region}
                </div>
            </div>
            `;
            universidadesContainer.innerHTML += card_uni;
        });
        if(universidadesContainer.children.length <= 3){
            if(window.innerWidth>800 || screen.width>800){
                const controls = document.querySelector('#destinos > div.controls');
                controls.style.display = "none";
            }
        }
    }
}).catch(err => {
    universidadesContainer.innerHTML = "Se ha producido un error, inéntelo de nuevo mas tarde.";
    prevButton.style.display = "none";
    nextButton.style.display = "none";
    allButton.style.display = "none";
});

// SPECIAL CONTROLS FOR MOBILE
const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
let scrollAmount = 0.33;
let extraScroll = 0;

if (width < 800){
    scrollAmount = 1.00;
    extraScroll = 20;
}

prevButton.onclick = () => {
    universidadesContainer.scrollLeft -= scrollAmount*(0.80*width) + extraScroll;
}
nextButton.onclick = () => {
    universidadesContainer.scrollLeft += scrollAmount*(0.80*width) + extraScroll;
}
allButton.onclick = (e) => {
    universidadesContainer.classList.toggle('verTodas');
    if(e.target.innerText === "Mostrar todas"){
        e.target.innerText = "Ver menos";
        prevButton.style.display = "none";
        nextButton.style.display = "none";
    }else{
        e.target.innerText = "Mostrar todas";
        prevButton.style.display = "inline";
        nextButton.style.display = "inline";
    }
}

// NEWSLETTER
// User feedback
let submitSuccess = document.getElementById('submitSuccessMessage');
let submitSuccessMsg = submitSuccess.getElementsByTagName('p')[0];
submitSuccess.style.display = "none";
let submitError = document.getElementById('submitErrorMessage');
let submitErrorMsg = submitError.getElementsByTagName('p')[0];
submitError.style.display = "none";

// Functionality
let suscribe_input = document.getElementById('email');
let suscribe_button = document.getElementById('suscriptionForm-button');

suscribe_input.oninput = () => {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(suscribe_input.value.match(mailformat)){
        suscribe_button.disabled = false;
        suscribe_button.classList.remove('disabled');
        suscribe_input.classList.remove('emailInvalid');
    }else{
        suscribe_button.disabled = true;
        suscribe_button.classList.add('disabled');
        suscribe_input.classList.add('emailInvalid');
    }
}

const myform = document.getElementById('suscriptionForm');
myform.onsubmit = (e) => {
    e.preventDefault();
    let email = document.getElementById('email');
    //CALL API
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "email": email.value,
        "last": new Date(1).toLocaleString() //Default date: 1/1/1970m 1:00:00
    });

    var requestOptions = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("/web-api/newsletter", requestOptions)
    .then(response => response.json())
    .then(result => {
        if(result.error){
            submitErrorMsg.innerText = result.data;
            submitError.style.display = "flex";
            suscribe_input.value = "";
        }else{
            submitSuccessMsg.innerText = result.data;
            submitSuccess.style.display = "flex";
            suscribe_input.parentNode.style.display = "none";
        }
    })
    .catch(err => {
        submitErrorMsg.innerText = 'Se ha producido un error... Inténtalo de nuevo más tarde, disculpa las molestias.';
        submitError.style.display = "flex";
        suscribe_input.value = "";
    });
}

// FAQ
const FAQitems = document.querySelectorAll("#faq button");

FAQitems.forEach(FAQitem => FAQitem.addEventListener('click', function(){
    const itemToggle = FAQitem.getAttribute('expanded');
    let countItems = FAQitems.length;
    for (i = 0; i < countItems; i++) {
        FAQitems[i].setAttribute('expanded', 'false');
    }
    if (itemToggle == 'false') {
        this.setAttribute('expanded', 'true');
    }
}));

// MODAL CREDITS
// Get the modal
const modal = document.getElementById("creditos");

// Get the buttons
const btn = document.getElementById("openModal");
btn.onclick = function() {
  modal.style.display = "block";
}

const span = document.getElementById("closeCreditos");
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}