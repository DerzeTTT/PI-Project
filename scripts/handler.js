//Constants
const openLogin = document.querySelector('#open-login');
const loginBox = document.querySelector('#login-box');

const loginButton = document.querySelector('#login-button')

const usernameField = document.querySelector('.username');
const passwordField = document.querySelector('.password');


//Variables
let webData = new Object();
webData.loginOpen = false;

webData.splitter = 'okwow';


//Functions
const toggleLoginBox = () => {

    webData.loginOpen = !webData.loginOpen;

    const styleStr = webData.loginOpen ? 'flex' : 'none';

    loginBox.style.display = styleStr;

};

const getCredentials = () => {

    const [username, password] = [usernameField.value, passwordField.value];

    if (username === '' || password === ''){

        alert('Username/Password can\'t be empty!');  
        return;

    };

    toggleLoginBox();

    usernameField.value = '';
    passwordField.value = '';

    return [username, password];

};

const loginUser = (reloadCallback) => {

    const [username, password] = getCredentials();

    loginToken = `${btoa(username)}${webData.splitter}${btoa(password)}`;
    document.cookie = `loginSession=${loginToken}`;

    webData.username = username;
    webData.password = password;

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
loginButton.addEventListener('click', () => {loginUser(); location.reload()});


//Misc
loginBox.style.display = 'none';

digestCookie();