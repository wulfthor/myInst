var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var mongoose = require('mongoose');
//var mongodb = require('mongodb').MongoClient;
//var monk = require('monk');

var routes = require('./routes/index');
var users = require('./routes/users');
var logger = require('./logger');

//mongoose.connect('mongodb://localhost:27017/images');

var app = express();
var json_body_parser = bodyParser.json();

//var url = 'localhost:27017/images';
//var url = 'mongodb://localhost:27017/images';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json({
  parameterLimit: 10000,
  limit: 1024 * 1024 * 10
}));

app.use(bodyParser.urlencoded({ 
  extended: true,
  parameterLimit: 10000,
  limit: 1024 * 1024 * 10
}));
app.use(cookieParser());

// Make our db accessible to our router
//app.use(function(req,res,next){
 // req.db = db;
  //next();
//});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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
