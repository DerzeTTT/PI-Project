//constants
const sql = require('mssql');
const http = require('http');
const sha256 = require('sha256');
const url = require('url');
const queryString = require('querystring');

const serverPort = 55405;

class credentials {

    constructor(user, pass){

        this.username = user;
        if(pass){this.hashed = sha256(pass)};

    };

    async validate(withPassword){

        const checkQuery = `SELECT * FROM [Users] WHERE Usernm='${this.username}'` + (withPassword ? ` AND Passwd='${this.hashed}'` : '');
        const queryResults = await queryDB(checkQuery);

        return queryResults.length !== 0;

    };

    async register(){

        const registerQuery = `INSERT INTO [Users] (Usernm, Passwd) VALUES ('${this.username}', '${this.hashed}')`;
        const queryResults = await queryDB(registerQuery);

        return queryResults

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

//REST API
const apiMethods = new Object();

apiMethods.GET = new Object();
apiMethods.POST = new Object();

apiMethods.GET['validate'] = async (req, res, params) => {

    const username = params.username;
    const password = params.password;

    const newCredentials = new credentials(username, password);
    const isValid = await newCredentials.validate(true);

    console.log(isValid);

    res.end(isValid ? '1' : '0');

};

apiMethods.GET['validateUsername'] = async (req, res, params) => {

    const username = params.username;

    const newCredentials = new credentials(username);
    const isValid = await newCredentials.validate();

    console.log(isValid);

    res.end(isValid ? '1' : '0');

};

apiMethods.POST['register'] = async (req, res, params) => {

    const username = params.username;
    const password = params.password;

    const newCredentials = new credentials(username, password);
    const registerStatus = await newCredentials.register() !== null ? '1' : '0';

    res.end(registerStatus);

};

const requestListener = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    const {pathname, query} = url.parse(req.url);

    const queryParams = queryString.parse(query);
    const endpoint = pathname.replace(/^\/+|\/+$/g, '');

    const tMethod = apiMethods[req.method];

    if (tMethod && tMethod[endpoint]){

        res.writeHead(200);
        tMethod[endpoint](req, res, queryParams);

    } else {

        res.writeHead(400);
        res.end('Invalid endpoint/method')

    };

};

const server = http.createServer(requestListener);

server.listen(serverPort, 'localhost', () => {

    console.log(`Listening on localhost:${serverPort}`);

});


// app.use(cors({
//     origin: '*'
// }));

// app.get('/validate', async (req, resp) => {

//     const username = req.query.username;
//     const password = req.query.password;

//     const newCredentials = new credentials(username, password);

//     const returned = await newCredentials.validate();

//     resp.header('Access-Control-Allow-Origin', `http://localhost:${serverPort}`);
//     resp.header('birdhass', 'okey');

//     resp.send(returned);

// });

// app.listen(serverPort, () => {

//     console.log('Listening');

// });

// queryDB("SELECT * FROM Users Where Usernm = 'Test'").then((recordSet) => console.log(recordSet))