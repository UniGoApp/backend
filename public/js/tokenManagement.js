const bearerToken = localStorage.getItem('tokenUniCarAPP_forAdminPanel__SecurityLevelAuth0_04082022');
let user = localStorage.getItem('adminUserUniCarAPP_forAdminPanel__SecurityLevelAuth0_04082022');

user = JSON.parse(user);

const checkToken = () => {
    if(!bearerToken || !user || user.rol === "USER"){
        window.location.assign('/login');
    }
};
const checkTokenOnLogin = () => {
    if(!!bearerToken && (user.rol === "ADMIN" || user.rol === "SUPER_ADMIN")){
        location.assign('/admin');
    }
};

//Header with token for fetch
const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', localStorage.getItem("tokenUniCarAPP_forAdminPanel__SecurityLevelAuth0_04082022"));

const logout = () => {
    localStorage.removeItem('tokenUniCarAPP_forAdminPanel__SecurityLevelAuth0_04082022');
    localStorage.removeItem('adminUserUniCarAPP_forAdminPanel__SecurityLevelAuth0_04082022');
    window.location.assign('/login');
};
