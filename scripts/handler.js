//Constants
const backendPort = 3050;

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

user.readData = function(){

    user.username = usernameField.value;
    user.password = passwordField.value;

    console.log(usernameField.value)

    if(user.username === '' || user.password === ''){

        incorrectInfo.style.display = 'flex';
        incorrectInfo.innerText = "*Username and password can't be empty!";

        return false;

    };

    return true;

};

user.register = function(){

    validatedFields = user.readData();
    if(!validatedFields){return};

    

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