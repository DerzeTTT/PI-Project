//Constants
const openLogin = document.querySelector('#open-login');
const loginBox = document.querySelector('#login-box');

const [username, password] = document.querySelector('.username'), document.querySelector('.password');

//Variables
let webData = new Object();
webData.loginOpen = false;


//Functions
const toggleLogin = () => {

    webData.loginOpen = !webData.loginOpen;

    const styleStr = webData.loginOpen ? 'flex' : 'none';

    loginBox.style.display = styleStr;

};

const loginUser = () => {



};


//Events
openLogin.addEventListener('click', toggleLogin);