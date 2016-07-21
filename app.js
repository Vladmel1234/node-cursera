var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var responseTime = require('response-time');
var session = require('express-session');
var FileStorege = require('session-file-store')(session);


var routes = require('./routes/index');
var users = require('./routes/users');
var dishes = require('./routes/dishes');
var promotions = require('./routes/promotion');
var leaderships = require('./routes/leadership');

var app = express();
//db setup

var url = 'mongodb://localhost:27017/test1';
var mongoose = require('mongoose').connect(url);
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function(){
    console.log('connected succesfully to db')
});

//Authorization
app.use(cookieParser());
//session
app.use(session({
    name:'session-id',
    secret:'secret',
    saveUninitialized:true,
    resave:true,
    store: new FileStorege
}));
var auth = require('./bin/auth.js');
app.use(auth.autho);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(responseTime());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/dishes',dishes);
app.use('/promotion',promotions);
app.use('/leadership',leaderships);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
