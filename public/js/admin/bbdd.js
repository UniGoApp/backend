// Tabs controller
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

// Search bars
const search = (e) => {
    const section = e.parentNode.parentNode.parentNode.parentNode;
    const bbddSection = section.id.split('-')[1];
    const table = section.getElementsByTagName('table')[0];
    const trs = table.querySelectorAll('tbody > tr');
    const input = new String(document.querySelector(`#${bbddSection}-searchQueryInput`).value);
    const regex = new RegExp(input, 'i');
    const isFoundInTds = td => regex.test(td.innerHTML);
    const isFound = childrenArr => childrenArr.some(isFoundInTds);
    trs.forEach(({ style, children }) => {
        style.display = isFound([...children]) ? '' : 'none' ;
    })
};

// Filters
const toggleUserType = (e) => {
    //Visual changes
    const parent = e.parentNode;
    for(let i=0; i<parent.children.length; i++){  
        if(parent.children[i].classList.contains('active')){
            parent.children[i].classList.remove('active');
        }
    }
    e.classList.add('active');

    //When click filter data by innerText from span.active
    const table = e.parentNode.parentNode.parentNode.getElementsByTagName('table')[0];
    const trs = table.querySelectorAll('tbody > tr');
    let filter = document.querySelector('#user-type > span.active').innerText;
    let setTrStyleDisplay = null;
    if(filter === "ALL") {
        setTrStyleDisplay = ({ style }) => {
            style.display = '';
        };
    }else{
        setTrStyleDisplay = ({ style, children }) => {
            style.display = (children[4].innerText === filter) ? '' : 'none' ;
        };
    }
    trs.forEach(setTrStyleDisplay);
};

if(user.rol !== 'SUPER_ADMIN'){
    document.getElementById('user-type').style.display = 'none';
}