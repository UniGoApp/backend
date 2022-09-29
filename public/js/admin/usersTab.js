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
    document.getElementById('user-type').getElementsByTagName('span')[2].style.display = 'none';
}

const mostrarUsuarios = () => {
    //Msg target
    const target = document.getElementById('usuarios').getElementsByTagName('tab-msg')[0];
    //Data targets
    const thead = document.getElementById('usuarios').getElementsByTagName('thead')[0];
    const tbody = document.getElementById('usuarios').getElementsByTagName('tbody')[0];
    //Remove previous data:
    thead.innerHTML="";
    tbody.innerHTML="";
    
    if(dataUsuarios.msg){
        target.innerText = dataUsuarios.msg;
        target.innerText = dataUsuarios.msg;
        document.querySelector('#usuarios > table').style.display = 'none';
    }else{
        //Table headings
        const trhead = document.createElement('tr');
        const keys = Object.keys(dataUsuarios.data[0]);
        keys.forEach(key => {
            if(key !== 'password'){
                const th = document.createElement('th');
                th.innerText = key;
                trhead.appendChild(th);
            }
        });
        thead.appendChild(trhead);

        //Table content
        dataUsuarios.data.forEach(user => {
            //DATA
            const trbody = document.createElement('tr');
            for(let d = 0; d < keys.length; d++){
                if(keys[d] !== 'password'){
                    const td = document.createElement('td');
                    let key = keys[d];
                    td.innerText = user[key];
                    trbody.appendChild(td);
                }
            }
            tbody.appendChild(trbody);
        });
    }
};

const refreshUsuarios = () => {
    fetch('/api/admin/usuarios', requestOptions)
    .then(response => response.json())
    .then(result => {
        if(!result.data){
            usuarios.innerText = 0;
        }else{
            usuarios.innerText = result.data.length;
        }
        dataUsuarios = result;
    })
    .catch(error => console.log('error', error))
    .finally(mostrarUsuarios());
};