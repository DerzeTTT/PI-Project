//constants
const sql = require('mssql');
const http = require('http');
const sha256 = require('sha256');
const url = require('url');
const queryString = require('querystring');
const formidable = require('formidable');
const fs = require('fs');
const admZip = require('adm-zip');

const serverPort = 55405;

class credentials {

    constructor(user, pass){

        this.username = user;
        if(pass){this.hashed = sha256(pass)};

    };

    async validate(withPassword){

        const checkQuery = `SELECT * FROM [Users] WHERE Usernm='${this.username}'` + (withPassword ? ` AND Passwd='${this.hashed}'` : '');
        const queryResults = await queryDB(checkQuery);

        console.log(queryResults);

        return queryResults.length !== 0;

    };

    async register(){

        const registerQuery = `INSERT INTO [Users] (Usernm, Passwd) VALUES ('${this.username}', '${this.hashed}')`;
        const queryResults = await queryDB(registerQuery);

        return queryResults

    };

    async getID(){

        const idQuery = `SELECT TOP(1) Id FROM [Users] WHERE Usernm='${this.username}'`;
        const queryResults = await queryDB(idQuery);

        console.log(queryResults, idQuery);

        return queryResults[0]['Id'];

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

const uploadDir = `${__dirname.replace(/\\/g, '/')}/uploaded`;

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

    console.log(registerStatus);

    res.end(registerStatus);

};

apiMethods.POST['upload'] = (req, res) => {

    let form = new formidable.IncomingForm();

    form.parse(req, async function (err, fields, files) {

        const newCredentials = new credentials(fields.username, fields.password);4

        if(!await newCredentials.validate()){

            console.log('Invalid credentials')
            res.end();

            return;

        };

        const oldPath = files.file.filepath;
        const userId = await newCredentials.getID();

        const holderPath = `${uploadDir}/${userId}`;

        if (!fs.existsSync(holderPath)){

            fs.mkdirSync(holderPath);
            console.log('created', holderPath);

        };
        
        fs.rename(oldPath, `${holderPath}/${files.file.originalFilename}`, (err) => {

            if(err) throw err;

            res.write('Uploaded');
            res.end();

        });

    });

};

const downloadFile = async function(filePath, res){

    console.log("Reading", filePath);

    const rs = fs.createReadStream(filePath);

    rs.pipe(res);

};

apiMethods.GET['retrieveAll'] = async (req, res, params) => {

    const username = params.username;
    const password = params.password;

    const newCredentials = new credentials(username, password);

    if(!await newCredentials.validate()){

        console.log('Invalid credentials')
        res.end();

        return;

    };

    const userId = await newCredentials.getID();
    const retrievingFolder = `${uploadDir}/${userId}`;

    console.log(retrievingFolder);

    if(!fs.existsSync(retrievingFolder)){

        res.writeHead(500);
        res.end();

        return;

    };

    fs.readdir(retrievingFolder, async (err, files) => {

        if (err){

            console.error(err);

            res.writeHead(500);
            res.end();

            return;

        };

        const zipFileName = `retrievedFiles.zip`;
        const newZip = new admZip();

        files.forEach((readingFile) => {

            const filePath = `${retrievingFolder}/${readingFile}`;
            console.log(filePath);

            newZip.addLocalFile(filePath);

        });
        
        const zipContent = newZip.toBuffer();

        res.setHeader("Content-Length", Buffer.byteLength(zipContent));
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Content-Disposition", `attachment; filename=${zipFileName}`);

        res.end(zipContent);

        fs.rmSync(retrievingFolder, {recursive: true, force: true});

    });

};  

const requestListener = (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const {pathname, query} = url.parse(req.url);

    const queryParams = queryString.parse(query);
    const endpoint = pathname.replace(/^\/+|\/+$/g, '');

    const tMethod = apiMethods[req.method];

    if (tMethod && tMethod[endpoint]){

        //res.writeHead(200);
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