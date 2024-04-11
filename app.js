const express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var https = require('https');
var multer = require('multer');
var path = require('path');
const cors = require('cors');
const passport = require('passport');
const app = express();
var _ = require('underscore');
var fs = require('fs');
var http = require('http');


// app.use(bodyParser.json({
// 	limit: '200mb'
// }));
// app.use(bodyParser.urlencoded({
// 	limit: '100mb',
// 	parameterLimit: 100000,
// 	extended: true}));


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

//app.use(cors());


/* Accept header wiht request */
app.use((req, res, next) => {
    console.log("Auth",req.header("Authorization"));
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization ,Accept');
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Credentials', "true");
    res.header(
        "Access-Control-Allow-Origin",
        "Origin", "x-Requested-With", "Content-Type", "Accept", "Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", 'PUT,  PATCH, GET, DELETE, POST');
        res.header("HTTP/1.1 200 OK"); 
    }
    next();
})



app.use(passport.initialize());
app.use(passport.session());
require('./authorization/passport')(passport);



console.log('Path',path.join(__dirname))
app.use(express.static(path.join(__dirname, '/public')));

const harvisapi = require('./router/harvis.router');
app.use('/mrsharvis', harvisapi);


const hostname = 'localhost';
const httpPort = 20;
const httpsPort = 2000;

const options = {  
//   key: fs.readFileSync('./pem/server.key'),
//   cert: fs.readFileSync('./pem/server.cert'),

  key: fs.readFileSync('/etc/letsencrypt/live/cerbosys.in-0001/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/cerbosys.in-0001/cert.pem'),
  
  requestCert: false,
  rejectUnauthorized: false
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

app.use((req, res, next) => {
  if(req.protocol === 'http'){
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
})

httpsServer.listen(httpsPort ,function () {
    console.log('Mrs. Harvis listening on port 2000!');
});
  
  httpServer.listen(httpPort ,function () {
    console.log('Mrs. Harvis listening on port 2000!');
});

// var port = 2000;
// var server = app.listen(port, function () {
//   console.log('Mrs. Harvis listening on port 2000!');
// });