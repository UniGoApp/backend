const bearerToken = sessionStorage.getItem('tokenUniGoAPP_forAdminPanel__SecurityLevelAuth0_04082022');
let user = sessionStorage.getItem('adminUserUniGoAPP_forAdminPanel__SecurityLevelAuth0_04082022');

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
        location.assign('/pr15@d052');
    }
};

const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', sessionStorage.getItem("tokenUniGoAPP_forAdminPanel__SecurityLevelAuth0_04082022"));

const logout = () => {
    sessionStorage.removeItem('tokenUniGoAPP_forAdminPanel__SecurityLevelAuth0_04082022');
    sessionStorage.removeItem('adminUserUniGoAPP_forAdminPanel__SecurityLevelAuth0_04082022');
    window.location.assign('/');
};
