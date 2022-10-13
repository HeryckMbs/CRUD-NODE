const pg = require('pg')

const client = new pg.Client(
    {
        user : 'postgres',
        host : 'localhost',
        database : 'trabalho',
        password : 'heryck',
        port : 5432
    }
);

module.exports = client;
