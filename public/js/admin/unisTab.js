const mainComunidades = document.getElementById('universidades-comunidades');
const mainUniversidades = document.getElementById('universidades-universidades');
const mainCampus = document.getElementById('universidades-campus');

const mostrarCampus = (e) => {
    //Clear previous data:
    mainCampus.innerHTML= '';
    let idUniversidad = '';
    let clicked = e.target;
    //Efecto visual del click
    if(clicked.nodeName == "P" || clicked.nodeName == "I"){
        
        clicked = clicked.parentNode;
    }
    idUniversidad = clicked.getAttribute('id-universidad');
    const parent = clicked.parentNode.getElementsByTagName('div');
    for(let element=0; element<parent.length; element++){
        parent[element].style.backgroundColor = 'transparent';
    }
    clicked.style.backgroundColor = "var(--blue)";
    //Show campus data
    for(let c = 0; c< dataCampus.data.length; c++){
        if(dataCampus.data[c].id_universidad == idUniversidad){
            const p = document.createElement('p');
            const div = document.createElement('div');
            p.innerText = dataCampus.data[c].nombre;
            div.appendChild(p);
            div.setAttribute("id-campus", dataCampus.data[c].id);
            mainCampus.appendChild(div);
        }
    }
};

const mostrarUniversidades = (e) => {
    //Clear previous data:
    mainUniversidades.innerHTML= '';
    mainCampus.innerHTML= '';
    let clicked = e.target;
    let idComunidad = '';
    //Efecto visual del click
    if(clicked.nodeName == "P" || clicked.nodeName == "I"){
        clicked = clicked.parentNode;
    }
    idComunidad = clicked.getAttribute('id-comunidad');
    const parent = clicked.parentNode.getElementsByTagName('div');
    for(let element=0; element<parent.length; element++){
        parent[element].style.backgroundColor = 'transparent';
    }
    clicked.style.backgroundColor = "var(--blue)";
    //Show campus data
    for(let u = 0; u< dataUniversidades.data.length; u++){
        if(dataUniversidades.data[u].id_comunidad == idComunidad){
            const p = document.createElement('p');
            const i = document.createElement('i');
            const div = document.createElement('div');
            i.classList.add('right');
            p.innerText = dataUniversidades.data[u].nombre;
            div.appendChild(p);
            div.appendChild(i);
            div.setAttribute("id-universidad", dataUniversidades.data[u].id);
            div.onclick = mostrarCampus;
            mainUniversidades.appendChild(div);
        }
    }
};

const mostrarComunidades = () =>{
    //Clear previous data:
    mainComunidades.innerHTML = '';
    mainUniversidades.innerHTML = '';
    mainCampus.innerHTML = '';
    //Get html target
    const target = document.getElementById('universidades').getElementsByClassName('tab-msg')[0];

    if(dataComunidades.msg){
        target.innerText = dataUniversidades.msg;
        document.querySelector('#universidades > section').style.display = 'none';
    }else{
        for(let c = 0; c< dataComunidades.data.length; c++){
            const p = document.createElement('p');
            const i = document.createElement('i');
            const div = document.createElement('div');
            i.classList.add('right');
            p.innerText = dataComunidades.data[c].nombre;
            div.appendChild(p);
            div.appendChild(i);
            div.setAttribute("id-comunidad", dataComunidades.data[c].id);
            div.onclick = mostrarUniversidades;
            mainComunidades.appendChild(div);
        }
    }
}

const refreshUniversidades = () => {

    fetch('http://localhost:8000/api/admin/comunidades', requestOptions)
    .then(response => response.json())
    .then(result => dataComunidades = result)
    .catch(error => console.log('error', error))
    .finally(mostrarComunidades());

    fetch('http://localhost:8000/api/admin/universidades', requestOptions)
    .then(response => response.json())
    .then(result => {
        if(!result.data){
            universidades.innerText = 0;
        }else{
            universidades.innerText = result.data.length;
        }
        dataUniversidades = result;
    })
    .catch(error => console.log('error', error));

    fetch('http://localhost:8000/api/admin/campus', requestOptions)
    .then(response => response.json())
    .then(result => dataCampus = result)
    .catch(error => console.log('error', error));
};