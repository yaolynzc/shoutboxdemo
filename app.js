var validate = require('./lib/middleware/validate');
var page = require('./lib/middleware/page');
var entries = require('./routes/entries');
var Entry = require('./lib/entry');
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var user = require('./lib/middleware/user');
var messages = require('./lib/messages');     //引入消息模板
var routes = require('./routes/index');
// var users = require('./routes/users');
var register = require('./routes/register');  //引入注册路由
var login = require('./routes/login');        //引入登录路由
var api = require('./routes/api');            //引入API中间件
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride());
app.use(cookieParser('your secret here'));
app.use(session({
  resave:false,
  saveUninitialized:false,
  secret: 'keyboard cat'
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api',api.auth);
app.use(user);
app.use(messages);

// app.use('/', page(Entry.count,5),entries.list);
// app.use('/users', users);
app.get('/register',register.form);
app.post('/register',register.submit);
app.get('/login',login.form);
app.post('/login',login.submit);
app.get('/logout',login.logout);
app.get('/post',entries.form);
app.post('/post',validate.required('entry.title'),validate.lengthAbove('entry.title',4),entries.submit);
app.get('/:page?',page(Entry.count,5),entries.list);

app.get('/api/user/:id',api.user);

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
