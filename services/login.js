const pool = require('../db/database');

function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    pool.query('SELECT * FROM user WHERE email = ? && password = ?', [email, password], (err, result) => {
        if (err) throw err;

        switch(result[0]) {
            case null: case undefined:
                res.send({status: false, msg: 'Invalid email or password'});
                break;
            default:
                let userResult = result[0];
                res.send({status: true, data: {
                    gender: userResult.gender,
                    fname: userResult.fname,
                    lname: userResult.lname,
                    address: userResult.address,
                    postcode: userResult.postcode,
                    email: userResult.email,
                    tel: userResult.tel
                }});
        }
    });
}

module.exports = {login};