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

const alreadyLogged = document.querySelector('.already-logged');

const alreadyLoggedText = document.querySelector('.already-logged span');
const logOut = document.querySelector('.log-out');

const uploadForm = document.querySelector('.upload-form');
const fileInput = document.querySelector('.browse-file');

const retrieveAll = document.querySelector('.retrieve');

//Objects
const user = new Object();
const design = new Object();

design.loginDisplayed = false;

user.loggedIn = false;
user.cookieSplitter = 'okwow';

user.username = '';
user.password = '';

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

    const username = usernameField.value;
    const password = passwordField.value;

    console.log(usernameField.value)

    if(username === '' || password === ''){

        design.displayIncorrect("Username and password can't be empty!");

        return false;

    };

    return [username, password];

};

const sendRequest = async function(sendingUrl, method, convertToJSON){

    const response = await fetch(`${backendServer}/${sendingUrl}`, {

        method: method,

    });

    return await convertToJSON ? response : response.json();

};

user.register = async function(){

    const validatedFields = user.readData();
    if(!validatedFields){return};

    const username = validatedFields[0];
    const password = validatedFields[1];

    const takenUsername = await sendRequest(`validateUsername?username=${username}`, 'GET');
    if(takenUsername==1){

        design.displayIncorrect("Username already taken");
        return;

    };

    const registerStatus = await sendRequest(`register?username=${username}&password=${password}`, 'POST');

    if (registerStatus==1){

        alert(`Successfully created account ${username}`);

    } else {

        design.displayIncorrect("Error while creating account");

    };

    await user.login(username, password);
    if(user.loggedIn){location.reload()};

};

user.getCookie = async function(username, password){

    const gotCookie = `${btoa(username)}${user.cookieSplitter}${btoa(password)}`;
    return gotCookie;

};

async function readCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

user.digestCookie = async function(){

    const foundCookie = await readCookie('loginSession');
    if(!foundCookie || foundCookie==''){document.cookie='loginSession='; return};

    const splitted = foundCookie.split(user.cookieSplitter);
    const [username, password] = [atob(splitted[0]), atob(splitted[1])];

    await user.login(username, password);
    
};

user.login = async function(username, password){

    const checkedCredentials = await sendRequest(`validate?username=${username}&password=${password}`, 'GET');
    if(checkedCredentials==0){

        design.displayIncorrect('Incorrect username or password');
        return;

    };

    const settingCookie = await user.getCookie(username, password);
    document.cookie = `loginSession=${settingCookie}`;

    console.log('Logging in as', username);

    loginBox.style.display = 'none';

    alreadyLoggedText.innerText = `Logged in as ${username}`;
    alreadyLogged.style.display = 'flex'

    user.loggedIn = true;

    user.username = username;
    user.password = password;

};

user.logOut = async function(){

    document.cookie = 'loginSession=';
    location.reload();

};

user.handleLogin = async function(){

    const validatedFields = user.readData();
    if(!validatedFields){return};

    await user.login(validatedFields[0], validatedFields[1]);
    if(user.loggedIn){location.reload()};

};

user.sendFile = async function(sendingFile){

    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append('file', sendingFile);

    formData.append('username', user.username);
    formData.append('password', user.password);

    xhr.open('POST', `http://localhost:${backendPort}/upload`, true);

    xhr.onload = () => {

        alert(xhr.status == 200 ? 'Successfully uploaded file' : 'Failed to upload file');

    };

    xhr.send(formData);

    console.log('Sent file');

};

// user.retrieveFiles = async function(){

//     const resp = await sendRequest(`retrieveAll?username=${user.username}&password=${user.password}`, 'GET');
//     const blob = await resp.blob();
    
//     const downloadLink = document.createElement('a');

//     downloadLink.href = URL.createObjectURL(blob);
//     downloadLink.download = 'retrievedFiles.zip';

//     document.body.appendChild(downloadLink);

//     downloadLink.click();

//     document.body.removeChild(downloadLink);

// };

user.retrieveFiles = async function() {

    const resp = await sendRequest(`retrieveAll?username=${user.username}&password=${user.password}`, 'GET', true);

    if(resp.status == 500){

        alert("Failed to retrieve files! Perhaps you didn't upload any?");
        return;
        
    };

    const blob = await resp.blob();

    const downloadLink = document.createElement('a');

    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'retrievedFiles.zip';

    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);

};
  

//Events
openLogin.addEventListener('click', design.toggleLogin);

registerButton.addEventListener('click', user.register);
loginButton.addEventListener('click', user.handleLogin);

logOut.addEventListener('click', user.logOut);

uploadForm.addEventListener('submit', (event) => {

    if(!user.loggedIn){alert('You need to be logged in to send files!'); return};

    event.preventDefault();

    const sendingFile = fileInput.files[0];

    user.sendFile(sendingFile);

});

retrieveAll.addEventListener('click', user.retrieveFiles);

//Misc
loginBox.style.display = 'none';
incorrectInfo.style.display = 'none';

user.digestCookie();

usernameField.value = '';
passwordField.value = '';