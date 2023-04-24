//Constants
const backendPort = 3050;

const openLogin = document.querySelector('#open-login');
const loginBox = document.querySelector('#login-box');

const loginButton = document.querySelector('.login-button');
const registerButton = document.querySelector('.register-button');

const usernameField = document.querySelector('.username');
const passwordField = document.querySelector('.password');

const user = new Object();

//user.username, user.password

//Variables
let webData = new Object();
webData.loginOpen = false;

//Functions
user.validateCredentials = () => {

    fetch(`http://localhost:${backendPort}/validate?` + new URLSearchParams({

        username:user.username,
        password:user.password

    }))
    .then((resp) => {

        return resp;

    })

};

user.login = () => {

    user.username = 'halo';
    user.password = 'test';

    console.log(user.validateCredentials())

};

user.register = () => {



};

const toggleLoginBox = () => {

    webData.loginOpen = !webData.loginOpen;

    const styleStr = webData.loginOpen ? 'flex' : 'none';

    loginBox.style.display = styleStr;

};

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const digestCookie = () => {

    loginSess = getCookie('loginSession');
    if (!loginSess){return};

    splitted = loginSess.split(webData.splitter);

    const [username, password] = [atob(splitted[0]), atob(splitted[1])];

    webData.username = username;
    webData.password = password;

    console.log(username, password);

};

const submitFile = () => {

    

};


//Events
openLogin.addEventListener('click', toggleLoginBox);

loginButton.addEventListener('click', () => {loginUser(getCredentials()); location.reload()});
registerButton.addEventListener('click', () => registerUser(getCredentials()));

//Misc
loginBox.style.display = 'none';

// digestCookie();
user.login();