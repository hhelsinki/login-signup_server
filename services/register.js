const pool = require('../db/database');

function register(req, res) {
    const gender = req.body.gender;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const address = req.body.address;
    const postcode = req.body.postcode;
    const email = req.body.email;
    const tel = req.body.tel;
    const password = req.body.password;

    pool.query('SELECT * FROM user WHERE email = ?', email, (err, result) => {
        if (err) throw err;

        switch(result[0]) {
            case null: case undefined:
                pool.query('INSERT INTO user (gender, fname, lname, address, postcode, email, tel, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [gender, fname, lname, address, postcode, email, tel, password], (err, result) => {
                    if (err) throw err;

                    switch(result.insertId) {
                        case 0:
                            res.send({status: false, msg: 'error DB: INSERT INTO user'});
                            break;
                        default:
                            res.send({status: true, msg: 'Successfully Signup!'});
                            break;
                    }
                });
                break;
            default:
                res.send({status:false, msg: 'The email is used.'});
                break;
        }
    })
}

module.exports = {register};