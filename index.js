const express = require('express');
const PORT = 3001;
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

//import functions
let {register} = require('./services/register');
let {login} = require('./services/login');

//config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//Routes
app.get('/login', login);
app.post('/signup', register);

//Server
app.listen(PORT, () => {
    console.log('Login Signup server is running on '+ PORT);
});