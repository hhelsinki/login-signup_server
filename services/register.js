const pool = require('../db/database');
require('dotenv').config();

const baseKeyApi = process.env.BASE_KEY_API;

function register(req, res) {
    let api_key = req.headers['api-key'];
    const gender = req.body.gender;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const address = req.body.address;
    const postcode = req.body.postcode;
    const email = req.body.email;
    const tel = req.body.tel;
    const password = req.body.password;

    if (api_key === baseKeyApi) {
        pool.query('SELECT * FROM user WHERE email = ?', email, (err, result) => {
            if (err) throw err;

            switch (result[0]) {
                case null: case undefined:
                    pool.query('INSERT INTO user (gender, fname, lname, address, postcode, email, tel, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [gender, fname, lname, address, postcode, email, tel, password], (err, result) => {
                        if (err) throw err;

                        switch (result.affectedRows) {
                            case 1:
                                res.send({ status: true, msg: 'Successfully Signup!' });
                                break;
                            default:
                                res.send({ status: false, msg: 'error DB: INSERT INTO user' });
                                break;
                        }
                    });
                    break;
                default:
                    res.send({ status: false, msg: 'The email is used.' });
                    break;
            }
        });
        return;
    }
    if (api_key !== baseKeyApi) {
        res.sendStatus(402);
        return;
    }


}

module.exports = { register };