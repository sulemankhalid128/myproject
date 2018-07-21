var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var msgs = [];

//send index page. app intro
app.get('/', (req, res) => res.render('msgForm', {title: "Massege App"}));

//show form 
app.get('/msgForm', (req, res) => res.render('sendmsg', {title: "Send Massege"}));

//show the Msg detail... All msgs.
app.get('/msg', (req, res) => 
res.render('seemsgs', {data : msgs, title: "All Masseges"}));

//add new msg api
app.post('/msg', (req, res) => {
  var detail = req.body;
   msgs.push(detail);
   res.redirect('/msg');
});

//delete api 
app.get('/msg/:name/delete', (req, res) => {
  var name = req.params.name;
  msgs = msgs.filter(function(Msg){
  return Msg.senderName != name;
  });
  res.redirect('/msg');
});

//find and paste on the form api.
app.get('/msg/:name', function(req, res){
  var name = req.params.name;
  var detail = msgs.find(function(msg){
    return msg.senderName == name;
  });
  console.log(detail);
  res.render('sendmsg', {data: detail, title : "Edit Page"});
});

app.post('/msg/:name', function(req, res){
  var name = req.params.name;
  var payload = req.body;
  msgs = msgs.map(function(object){
    if(object.senderName == name){
      object = Object.assign(object, payload);
    }
    return object;
  });
  res.redirect('/msg');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
