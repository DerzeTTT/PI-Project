const sql = require('mssql')

const config = {
    user: 'Admin50',
    password: 'OkeyBird',
    server: 'localhost',
    database: 'RemoteHostingDB',
    options: {
        encrypt: false,
    }
}

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

}

queryDB("SELECT * FROM Users Where Usernm = 'Test'").then((recordSet) => console.log(recordSet))