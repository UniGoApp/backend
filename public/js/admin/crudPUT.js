//PUT METHODS and FORMS
const showPutForm = (e) => {
    //Similar al Delete en logica para ver en que seccion estoy
    const modal = document.getElementById('modalPut');
    modal.classList.add('modal-opened');
    modal.querySelector('h4').innerText = '';
    modal.querySelector('p').innerText = '';
    const body = modal.querySelector('section.modal-container-body > div');
    body.innerHTML = '';

    const target_id_table = e.target.parentNode.parentNode.getElementsByTagName('td')[0].innerText;

    modal.querySelector('h4').innerText = "Va a modificar el usuario con id: " + target_id_table;
};

const putData = (e) => {
    console.log('putData');
};
