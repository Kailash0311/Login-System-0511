var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var index = require('./routes/index');
var users = require('./routes/users');
//var findOrCreate=require('mongoose-findorcreate');

//mongoose database connection

var mongoose=require('mongoose');
var url='mongodb://localhost:27017/1user'
 var db

 

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
var passport=require('passport'), 
FacebookStrategy=require('passport-facebook').Strategy;
//passport
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
})

var Schema = mongoose.Schema;
var UserSchema = new Schema(
  {
  facebookId: Number,
  username:String,
  email: String,
  gender: String,
  provider:String

});

var User = mongoose.model('User', UserSchema);


app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email']}));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect:'/users',failureRedirect: '/'}),
function(req,res){
  res.redirect('/');
}
);

 

passport.use(new FacebookStrategy({
clientID:'1997237017267937',
clientSecret: '961f12f5ac42d1defe1aaf602f506213',
callbackURL:"http://localhost:3000/auth/facebook/callback",
profileFields: ['id', 'displayName', 'photos', 'email'],
enableProof: true
},
function(accesToken,refreshToken,profile,done){
  User.findOne({facebookId:profile.id} , function(err,user){
    if(err){
      return done(err);
    }
    if(!user)
    {
      //adding the new user's data
            user = new User
            ({
              provider: 'facebook',
              facebook: profile._json,
              username:profile.displayName,
              email:profile.email,
              facebookId:profile.id
          
            }),
      //saving and adding user into the database

      user.save().then(function(user)
      {
       
        //if(err){console.log("not inserted")}
        if(user){
          console.log(user.username + "inserted into the database collection"+user.email)
        };

      });
      

        console.log(profile.displayName+" has logged in with e-mail id : "+ profile.emails)
        //name is made as global so that it can be accessible from other files and can be rendered to the jade template :)
          global.name=profile.displayName;
          return done(null,user);
    } 
    else{
      
      //updating and overwriting the user's data , if changed 
      user = new User
            ({
              provider: 'facebook',
              facebook: profile._json,
              username:profile.displayName,
              email:profile.email,
              facebookId:profile.id
          
            })
          global.name=profile.displayName;
      console.log("welcome "+ user.username+profile.emails);
      return done(null,user);
    }
  })
}))


app.get('/logout', function(req, res){
  console.log("hello")
  req.logOut();
  res.redirect('/');
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

module.exports = app 