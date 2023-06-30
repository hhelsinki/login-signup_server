const mysql = require('mysql');

const pool = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'meanttobe',
    database: 'login_signup'
});

pool.connect((err) => {
    if (!!err) {
        console.log(err)
    }
});

module.exports = pool;