var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var dotenv = require('dotenv');
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var mongoose = require('mongoose')
var session = require('express-session')
var passport  = require('passport')
var flash = require('connect-flash')
var validator = require('express-validator')
var MongoStore = require('connect-mongo')(session)
var fileUpload = require('express-fileupload');
var csrf = require('csurf')

var common_helper = require('./helpers/common_helper')
require('./config/passport')
var db = require('./config/database')

var app = express();
var csrfProtection = csrf()

db.connection()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

global.__basedir = __dirname;


app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//file upload
app.use(fileUpload());

app.use(session({
  secret:'bjasbcasjcbhj',
  resave : false,
  saveUnintialized : false,
  store : new MongoStore({mongooseConnection : mongoose.connection}),
  cookie : {maxAge : 180*60*1000},
}))

app.use(flash());
app.use(validator())
app.use(passport.initialize());
app.use(passport.session());

var appMiddleware = require('./middlewares/appMiddleware')

app.use(async function(req, res, next) {
  let requestSegments = req.path.split('/');
  console.log(requestSegments)
	appMiddleware.app(req, res, next);
});

//calling the routes
var webRouter = require('./routes/webRoute')
webRouter.routes(app)



// catch 404 and forward to error handler
app.use(async function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
