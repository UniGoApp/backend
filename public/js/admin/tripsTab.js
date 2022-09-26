const mostrarViajes = () =>{
    //Clear previous data:
    document.querySelector('#viajes > section').innerHTML= '';
    //Get html target
    const target = document.getElementById('viajes').getElementsByClassName('tab-msg')[0];

    if(dataViajes.msg){
        target.innerText = dataViajes.msg;
        document.getElementById('mensajes-cards').style.display = 'none';
    }else{
        const section = document.querySelector('#viajes > section');
        dataViajes.data.forEach(info => {
            const div = document.createElement('div');
            const card = document.createElement('details');
            card.classList.add('card');
            card.setAttribute("viaje-id", info.id);

            const summary = document.createElement('summary');
            summary.innerHTML = 'Viaje ' + info.id + ' - <strong>' + info.estado+'</strong>';
            const p_usuario = document.createElement('p');
            p_usuario.innerText = 'ID usuario: ' + info.id_usuario + ` , ${info.username} [${info.email}, ${info.phone}]`;
            card.appendChild(summary);
            card.appendChild(p_usuario);
            const p_salida = document.createElement('p');
            p_salida.innerText = 'Salida: ' + info.salida;
            card.appendChild(p_salida);
            const p_origen_destino = document.createElement('p');
            p_origen_destino.innerText = 'Origen: ' + info.origen + ' | Destino: ' + info.destino;
            card.appendChild(p_origen_destino);
            const p_plazas_precio = document.createElement('p');
            p_plazas_precio.innerHTML = 'Plazas (ocupadas/totales): ' + info.plazas + '/' + info.totales + ' | <strong>Precio: '+info.precio+'€ </strong>';
            card.appendChild(p_plazas_precio);
            const p_observaciones = document.createElement('p');
            p_observaciones.innerText = 'Observaciones: ' + info.observaciones;
            card.appendChild(p_observaciones);
            // const pasajeros = document.createElement('p');
            // pasajeros.innerHTML = 'Pasajeros: ';
            // card.appendChild(pasajeros);
            // const pasajeros_list = document.createElement('ul');
            // for(let i=0; i<info.id_pasajerospasajeros.length; i++){
            //     const pas = `<li>${info.id_pasajeros[i]}</li>`;
            //     pasajeros_list.appendChild(pas);
            // }
            // card.appendChild(pasajeros_list);
            section.appendChild(card);
            
        });
    }
}

const refreshViajes = () => {
    fetch('http://localhost:8000/api/admin/viajes', requestOptions)
    .then(response => response.json())
    .then(result => {
        if(!result.data){
            viajes.innerText = 0;
        }else{
            viajes.innerText = result.data.length;
        }
        dataViajes = result;
    })
    .catch(error => console.log('error', error))
    .finally(mostrarViajes());
};