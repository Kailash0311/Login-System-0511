var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var session=require('express-session');
var index = require('./routes/index');
var users = require('./routes/users');
var passport=require('passport'), 
FacebookStrategy=require('passport-facebook').Strategy;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret:'hello'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
 
//mongoose database connection
var mongoose=require('mongoose');
var url='mongodb://localhost:27017/user1'
 var db
 var mongo=require('./mongo.js')

mongoose.connect(url,function(err,database)
{
if(err)
  {
    console.log("Didn't connect to the database server..22111")
  }
else
  {
    db=database;
    console.log("Connected succesfully to the server...")
  }
}

)



//passport
app.use(passport.initialize());
app.use(passport.session());


var fbauth=require('./fbauth.js');
fbauth(passport);
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['user_friends', 'email', 'public_profile']}));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect:'/users',failureRedirect: '/',scope:['emails']}),
function(req,res){
  res.redirect('/');
}
);
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/')
  
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

module.exports = app