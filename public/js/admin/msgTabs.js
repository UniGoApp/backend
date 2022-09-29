const mostrarMensajes = () =>{
    //Clear previous data:
    document.getElementById('mensajes-cards').innerHTML= '';
    //Get html target
    const target = document.getElementById('mensajes').getElementsByClassName('tab-msg')[0];

    if(dataMensajes.msg){
        target.innerText = dataMensajes.msg;
        document.getElementById('mensajes-cards').style.display = 'none';
    }else{
        const section = document.getElementById('mensajes-cards');
        dataMensajes.data.forEach(info => {
            const div = document.createElement('div');
            const card = document.createElement('details');
            card.setAttribute("card-id", info.id);
            const summary = document.createElement('summary');
            const p = document.createElement('p');
            summary.innerText = 'Mensaje ' + info.id + ': ' + info.asunto;
            p.innerText = info.mensaje;
            card.appendChild(summary);
            card.appendChild(p);
            card.classList.add('card');
            section.appendChild(card);
        });
    }
}

const refreshMensajes = () => {
    //Clear previous data:
    document.getElementById('mensajes-cards').innerHTML= '';

    //New data:
    fetch('/api/admin/mensajes', requestOptions)
    .then(response => response.json())
    .then(result => {
        if(!result.data){
            mensajes.innerText = 0;
        }else{
            mensajes.innerText = result.data.length;
        }
        dataMensajes = result;
    })
    .catch(error => console.log('error', error))
    .finally(mostrarMensajes());
};