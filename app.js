var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var users = require('./routes/users');

//mongoose database connection

var mongoose=require('mongoose');
var url='mongodb://localhost:27017/user'
 var db

 

mongoose.connect(url,function(err,database)
{
if(err)
  {
    console.log("Didn't connect to the database server..22111")
  }
else
  {
    console.log("Connected succesfully to the server...")
  }
}

)

//schema for mongoose

/*mongoose.model('User',{
  *username:String,
  email: String,
  gender: String,
  facebookId:Number
});*/

//passport

var passport=require('passport'), FacebookStrategy=require('passport-facebook').Strategy;

var Schema = mongoose.Schema;
var UserSchema = new Schema(
  {
  facebookId: Number,
  username:String,
  email: String,
  gender: String,

});

var User = mongoose.model('User', UserSchema);

passport.use(new FacebookStrategy({
clientID:'1997237017267937',
clientSecret: 'xxxxxxxxxxxxxx',
callbackURL:"http://localhost:3000/auth/facebook/callback"

},
function(accesToken,refreshToken,profile,done){
  User.findOne({facebookId:profile.id} , function(err,user){
    if(err){
      return done(err);
    }
    if(!user){
            
            user : new User({
            username:profile.displayName,
            email:profile.email,
            
      },
      console.log(profile.displayName));
      return done(null,user);
     /* user.save(function(err)
      {
          if(err) console.log(err);
          return done(err,user);

      })*/
    }
    else{
      return done(null,user);
      //console.log("welcome "+ profile.displayName);
    }
    

  })
}
));

var app = express();

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    console.log("userss...")
    res.redirect('/users');
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

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
