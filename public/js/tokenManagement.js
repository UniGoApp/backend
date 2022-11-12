const bearerToken = localStorage.getItem('tokenUniGoAPP_forAdminPanel__SecurityLevelAuth0_04082022');
let user = localStorage.getItem('adminUserUniGoAPP_forAdminPanel__SecurityLevelAuth0_04082022');

try{
    user = JSON.parse(user);
}catch(err){
    window.location.assign('/');
}

const checkToken = () => {
    if(!bearerToken || !user || user.rol === "USER"){
        window.location.assign('/');
    }
};
const checkTokenOnLogin = () => {
    if(!!bearerToken && (user.rol === "ADMIN" || user.rol === "SUPER_ADMIN")){
        location.assign('/admin');
    }
};

const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', localStorage.getItem("tokenUniGoAPP_forAdminPanel__SecurityLevelAuth0_04082022"));

const logout = () => {
    localStorage.removeItem('tokenUniGoAPP_forAdminPanel__SecurityLevelAuth0_04082022');
    localStorage.removeItem('adminUserUniGoAPP_forAdminPanel__SecurityLevelAuth0_04082022');
    window.location.assign('/');
};
