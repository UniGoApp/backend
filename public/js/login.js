let email = document.getElementById('login__email');
let password = document.getElementById('login__password');
let error_box = document.getElementById('error_msg');
let remember = document.getElementById('remember');

if (localStorage.checkbox && localStorage.checkbox !== "") {
    remember.setAttribute("checked", "checked");
    email.value = localStorage.username;
    password.value = localStorage.password;
} else {
    remember.removeAttribute("checked");
    email.value = "";
    password.value = "";
}
const togglePassword = (e) => {
    if(password.type === "password"){
        password.type="text";
        e.classList.add('visible');
    }else{
        password.type="password";
        e.classList.remove('visible');
    }
};

const login = () => {      
    if (remember.checked && email.value !== "" && password.value !== "") {
        localStorage.username = email.value;
        localStorage.password = password.value;
        localStorage.checkbox = remember.value;
    } else {
        localStorage.username = "";
        localStorage.password = "";
        localStorage.checkbox = "";
    }
    
    if(!email.value || !password.value){
        error_box.classList.remove('icons');
        error_box.children[1].innerHTML = 'Check form fields please.';
    }else{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": email.value,
            "password": password.value
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

        fetch("/api/admin/signin", requestOptions)
        .then(response => response.json())
        .then(result => {
            //Check token an user info received
            if(!result.error && (result.user.rol === "SUPER_ADMIN" || result.user.rol === "ADMIN")){
                const token = 'Bearer ' + result.token;
                sessionStorage.setItem('tokenUniGoAPP_forAdminPanel__SecurityLevelAuth0_04082022', token);
                const usuario = JSON.stringify(result.user);
                sessionStorage.setItem('adminUserUniGoAPP_forAdminPanel__SecurityLevelAuth0_04082022', usuario);
                window.location.assign('/privado');
            }else{
                error_box.classList.remove('icons');
                error_box.children[1].innerHTML = result.error;
                document.getElementsByTagName('form')[0].reset();
            }
        })
        .catch(error => {
            error_box.innerText = "Se ha producido un error inesperado...";
        });
    }
};

document.getElementById('submitLogin').addEventListener("click", login, false);
