const toggleUserType = (e) => {
    //Visual changes
    const parent = e.parentNode;
    for(let i= 0 ; i < parent.children.length; i++){  
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
            style.display = (children[3].innerText === filter) ? '' : 'none' ;
        };
    }
    trs.forEach(setTrStyleDisplay);
};

if(user.rol !== 'SUPER_ADMIN'){
    document.getElementById('user-type').style.display = 'none';
}