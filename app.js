var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');
var setUpPassport = require('./setup_passport');
var dayRoutes = require('./routes/day/day.route');
var userRoutes = require('./routes/user/user.route');
var productRoutes = require('./routes/product/product.route');
var jobRoutes = require('./routes/job/job.route');
var authRoutes = require('./routes/authentication/auth.route');

var app = express();

if (!process.env.Mongo_Admin_PW) {
  console.log("Can't find Mongo PW", process.env.Mongo_Admin_PW);
  throw new Error("Can't find Mongo PW");
}

const uri = "mongodb+srv://admin:" + process.env.Mongo_Admin_PW + "@dayinthelife-dev.ionl7x1.mongodb.net/?retryWrites=true&w=majority";
var port = process.env.PORT || 4201;
//connect to the Database
try {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
} catch (e) {
  console.log(e);
}
setUpPassport();



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//test endpoint to see if server is up
app.get('/ping', function (request, response) {
  console.log('PING');
  response.send({ ping: 'ping' });
});

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use('/day', dayRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/job', jobRoutes);
app.use('/auth',authRoutes);

app.listen(port, function () {
  console.log('Server is running my server on PORT: ' + port);
});



module.export = app;