const pool = require('../db/database');
const randToken = require('rand-token');
require('dotenv').config();

const baseKeyApi = process.env.BASE_KEY_API;

function login(req, res) {
    let api_key = req.headers['api-key'];
    const email = req.body.email;
    const password = req.body.password;

    if (api_key === baseKeyApi) {
        pool.query('SELECT * FROM user WHERE email = ? && password = ?', [email, password], (err, result) => {
            if (err) throw err;

            switch (result[0]) {
                case null: case undefined:
                    res.send({ status: false, msg: 'Invalid email or password' });
                    break;
                default:
                    const newToken = randToken.generate(8);

                    pool.query('UPDATE user SET access_token = ? WHERE email = ?', [newToken, email], (err, result) => {
                        if (err) throw err;

                        console.log(result)
                        switch (result.affectedRows) {
                            case 1:
                                res.send({ status: true, token: newToken });
                                break;
                            default:
                                res.send({ status: false, msg: 'Server error' });
                                console.log('db error: UPDATE user SET access_token');
                                break;
                        }
                    });
            }
        });
        return;
    }
    if (api_key !== baseKeyApi) {
        res.sendStatus(402);
        return;
    }

}

const getProfile = (req, res) => {
    let api_key = req.headers['api-key'];
    let user_token = req.headers['user-token'];

    if (api_key === baseKeyApi) {
        if (user_token) {
            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.send({ status: false, msg: 'Invalid token' });
                        break;
                    default:
                        let userResult = result[0];
                        res.send({
                            status: true, data: {
                                gender: userResult.gender,
                                fname: userResult.fname,
                                lname: userResult.lname,
                                address: userResult.address,
                                postcode: userResult.postcode,
                                email: userResult.email,
                                tel: userResult.tel
                            }
                        });
                        break;
                }
            });
            return;
        }
        if (!user_token) {
            res.sendStatus(401);
            return;
        }
        return;
    }
    if (api_key !== baseKeyApi) {
        res.sendStatus(402);
        return;
    }
}

module.exports = { login, getProfile };
