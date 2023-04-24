//constants
const sql = require('mssql');
const express = require('express');
const sha256 = require('sha256');

const app = express();
const serverPort = 3050;

class credentials {

    constructor(user, pass){

        this.username = user;
        this.hashed = getHash(pass);

    };

    validate(){

        const checkQuery = `SELECT * FROM [Users] WHERE Usernm=${this.username} AND Passwd=${this.hashed}`;
        console.log(checkQuery);

        results = queryDB(checkQuery);

        console.log(results);

    };
    
}

const config = {
    user: 'Admin50',
    password: 'OkeyBird',
    server: 'localhost',
    database: 'RemoteHostingDB',
    options: {
        encrypt: false,
    }
};


//functions
const queryDB = (tQuery) => {

    return sql.connect(config)
        .then(pool => {
            return pool.request().query(tQuery);
        })

        .then(result => {
            return result.recordsets[0];
        })

        .catch(err => {
            console.log(err);
            return null;
        });

};

const getHash = (rawPass) => {

    console.log(rawPass);

    return sha256(rawPass);

};

//REST API
app.get('/validate', (req, resp) => {

    const username = req.query.username;
    const password = req.query.password;

    const newCredentials = new credentials(username, password);

    const returned = newCredentials.validate();

    resp.send(returned);

});

app.listen(serverPort, () => {

    console.log('Listening');

});

// queryDB("SELECT * FROM Users Where Usernm = 'Test'").then((recordSet) => console.log(recordSet))