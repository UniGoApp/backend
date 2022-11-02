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

const search = (e) => {
    const table = e.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('table')[0];
    const trs = table.querySelectorAll('tbody > tr');
    const filter = document.querySelector('#searchQueryInput').value;
    const filter2 = document.querySelector('#user-type > span.active').innerText;
    const regex = new RegExp(filter, 'i');
    const isFoundInTds = td => regex.test(td.innerHTML);
    const isFound = childrenArr => childrenArr.some(isFoundInTds);
    const setTrStyleDisplay = ({ style, children }) => {
        style.display =
        (isFound([...children]) && (children[3].innerText === filter2 || filter2 === "ALL")) ? '' : 'none' ;
    }
    trs.forEach(setTrStyleDisplay)
    //Si quito filter 2 y parentesis global despues del && lo hago util para cualquier searchBar
};

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