//Constants
const backendPort = 55405;
const backendServer = `http://localhost:${backendPort}`;

const openLogin = document.querySelector('#open-login');
const loginBox = document.querySelector('#login-box');

const loginButton = document.querySelector('.login-button');
const registerButton = document.querySelector('.register-button');

const usernameField = document.querySelector('.username');
const passwordField = document.querySelector('.password');

const incorrectInfo = document.querySelector('.incorrect');

//Objects
const user = new Object();
const design = new Object();

design.loginDisplayed = false;

//Functions
design.toggleLogin = function(){

    design.loginDisplayed = !design.loginDisplayed;
    loginBox.style.display = design.loginDisplayed ? 'flex' : 'none';

};

design.displayIncorrect = function(msg){

    incorrectInfo.style.display = 'flex';
    incorrectInfo.innerText = '*'+msg;

};

user.readData = function(){

    user.username = usernameField.value;
    user.password = passwordField.value;

    console.log(usernameField.value)

    if(user.username === '' || user.password === ''){

        design.displayIncorrect("Username and password can't be empty!");

        return false;

    };

    return true;

};

const sendRequest = async function(sendingUrl, method){

    const response = await fetch(`${backendServer}/${sendingUrl}`, {

        method: method,

    });

    return await response.json();

};

user.register = async function(){

    const validatedFields = user.readData();
    if(!validatedFields){return};

    const takenUsername = await sendRequest(`validateUsername?username=${user.username}`, 'GET');
    if(takenUsername===1){

        design.displayIncorrect("Username already taken");
        return;

    };

    const registerStatus = await sendRequest(`register?username=${user.username}&password=${user.password}`, 'POST');

    if (registerStatus===1){

        alert(`Successfully created account ${user.username}`);

    } else {

        design.displayIncorrect("Error while creating account");

    };

};

user.login = function(){



};

//Events
openLogin.addEventListener('click', design.toggleLogin);

registerButton.addEventListener('click', user.register);
loginButton.addEventListener('click', user.login);

//Misc
loginBox.style.display = 'none';
incorrectInfo.style.display = 'none';