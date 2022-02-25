const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const signup = require('./routes/signup');
const login=require('./routes/login');
const donor=require('./routes/donor');
const home = require('./routes/home');

const bloodbank=require('./routes/bloodbank');
const updatedonor=require('./routes/updatedonor');
const showdonor=require('./routes/viewdonor');
const request=require('./routes/request');
const search=require('./routes/search');
const showbloodbank=require('./routes/showbloodbank');
const showreq=require('./routes/showreq');
//oracle();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(showdonor);
app.use(request);
app.use(home);
app.use(login);
app.use(showbloodbank);
app.use(signup);
app.use(showreq);
app.use(donor);
app.use(bloodbank);
app.use(search);
app.use(updatedonor);
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.use((err, req, res, next) => {
    console.error('Request failed:', err.status === 400 ? 'invalid input' : 'database/server error');
    const status = err.status === 400 ? 400 : err.code === '23505' ? 409 : ['23514', '22007', '22008', '22P02'].includes(err.code) ? 400 : 500;
    res.status(status).send(status === 400 ? 'Invalid input.' : status === 409 ? 'A record with this key already exists.' : 'Database operation failed. Check local server configuration.');
});
if (require.main === module) app.listen(Number(process.env.PORT || 3000), '127.0.0.1');
module.exports = app;
