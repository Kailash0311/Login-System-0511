var User=require('./gmongo.js');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
module.exports=function(passport){passport.use(new GoogleStrategy({
    clientID: '1024588149925-oocq5opnetc4socflc4heqdfm60upqmd.apps.googleusercontent.com',
    clientSecret: 'TgARsqDjcK-Gs-U7Ci78T_Pm',
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOne({ googleId: profile.id }, function (err, user) {
           if(user){
               user.gender=profile.gender;
               user.username=profile.displayName;
               user.photo=profile.photos[0].value;
               console.log('User already in the database and checked and updated the recored based on his google account.')
               user.save().then(function(user)
               {
                 if(user){
                   console.log(user.username + "inserted into the database collection"+user.email+user.bday)
                 };
              return done(err, user);
            });
            }
           else {
               user=new User ({
            googleId:profile.id,       
            email:profile.emails[0].value  ,
            gender:profile.gender,
            username:profile.displayName,
            photo:profile.photos[0].value
           })}
           user.save().then(function(user)
          {
            if(user){
              console.log(user.username + "inserted into the database collection"+user.email+user.bday)
            };
         return done(err, user);
       });
  })}))}
