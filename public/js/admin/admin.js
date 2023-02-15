// LOADER effect
const content = document.querySelectorAll('body > *');
for(let i=0; i<content.length; i++){
    content[i].classList.toggle('oculto');
}
window.addEventListener('load', (event) => {
    for(let i=0; i<content.length; i++){
        content[i].classList.toggle('oculto');
    }
    document.querySelector('#loader').classList.toggle('oculto');
});

const tabsHandler = (e) => {
    //Visual changes in navigation: 
    const parent = e.parentNode;
    for(let i= 0 ; i < parent.children.length; i++){  
        if(parent.children[i].classList.contains('active')){
            parent.children[i].classList.remove('active');
        }
    }
    e.classList.add('active');
    //Hide previous tab: 
    const tabsParent = document.getElementsByTagName('main')[0].children;
    for(let div = 0; div < tabsParent.length; div++){
        if(tabsParent[div].classList.contains('visible')){
            tabsParent[div].classList.remove('visible');
        }
    }
    //Show clicked one: 
    const tabId = e.children[1].innerHTML.toLowerCase();
    document.getElementById(tabId).classList.add('visible');
};

const tabsHandlerMobile = (e) => {
    //Visual changes in navigation: 
    const parent = e.parentNode;
    for(let i= 0 ; i < parent.children.length; i++){  
        if(parent.children[i].classList.contains('active')){
            parent.children[i].classList.remove('active');
        }
    }
    e.classList.add('active');
    //Hide previous tab: 
    const tabsParent = document.getElementsByTagName('main')[0].children;
    for(let div = 0; div < tabsParent.length; div++){
        if(tabsParent[div].classList.contains('visible')){
            tabsParent[div].classList.remove('visible');
        }
    }
    //Show clicked one: 
    const tabId = e.innerHTML.toLowerCase();
    document.getElementById(tabId).classList.add('visible');

    //Close menu
    setTimeout(() => {
        document.getElementById('burguer-menu').checked = false;
    }, 150);
};