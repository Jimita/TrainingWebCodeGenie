var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {engine:exphbs} = require('express-handlebars');
var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const _handlebars = require('handlebars');


global.config = require('./config/config.json');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout: false,
    handlebars: allowInsecurePrototypeAccess(_handlebars)
}));
app.set('view engine', 'handlebars');

// require user model

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// DB connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://adminPaneldb:adminPaneldb@localhost:27017/adminPaneldb")
    .then(() => console.log("Connection DB Open"))
    .catch((err) => console.error(err));

app.use('/', indexRouter);
app.use('/users', usersRouter);
require("./function/isAdmin")
require("./function/cron")
// require("./cronjob/fileProcessCron")
// require("./cronjob/mailcron")


// catch 404 and forward to error handler
app.use(function(req, res, next) {
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
