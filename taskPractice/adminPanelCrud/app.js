var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs = require('express-handlebars');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const nodemailer = require("nodemailer");
var mongoose = require('mongoose');
const _handlebars = require("handlebars");
// const helpers = require("handlebars-helpers");

const Bcrypt = require("bcryptjs");
var cors = require('cors')

let {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var subcategoryRouter = require('./routes/subcategory');
var productRouter = require('./routes/product');
var stateRouter = require('./routes/state');
var cityRouter = require('./routes/city');
var areaRouter = require('./routes/area');
var adminRouter = require('./routes/admin');
var formRouter = require('./routes/form');
var taskRouter = require('./routes/callTask');

const { handlebars } = require('hbs');
// var cartRouter = require('./routes/cart');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(_handlebars),
    handlebars:handlebars
}));

handlebars.registerHelper("add", function(value1,value2){
    return value1 + value2;
});

// app.set('view engine', 'hbs');
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { maxAge: 600000 }
}))

// DB connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://adminPaneldb:adminPaneldb@localhost:27017/adminPaneldb")
    .then(() => console.log("Connection DB Open"))
    .catch((err) => console.error(err));

app.use('/', indexRouter);
app.use('/admin/users', usersRouter);
app.use('/admin/category', categoryRouter);
app.use('/admin/subcategory', subcategoryRouter);
app.use('/admin/product', productRouter);
app.use('/admin/state', stateRouter);
app.use('/admin/city', cityRouter);
app.use('/admin/area', areaRouter);
app.use('/admin/account', adminRouter);
app.use('/admin/form', formRouter);
app.use('/task', taskRouter);

// app.use('/cart', cartRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
app.use(cors())
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