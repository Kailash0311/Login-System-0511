var User=require('./mongo.js');
var passport=require('passport');
var FacebookStrategy=require('passport-facebook').Strategy;

module.exports=function(passport){
    passport.use(new FacebookStrategy({
    clientID:'1997237017267937',
    clientSecret: '961f12f5ac42d1defe1aaf602f506213',
    callbackURL:"http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email', 'birthday', 'friends', 'first_name', 'last_name', 'middle_name', 'gender', 'link'],
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
                  email:profile.emails,
                  facebookId:profile.id,
                  bday:profile.birthday,
                  photo:profile.photos
              
                }),
          //saving and adding user into the database
    
          user.save().then(function(user)
          {
           
            //if(err){console.log("not inserted")}
            if(user){
              console.log(user.username + "inserted into the database collection"+user.email+user.bday)
            };
    
          });
          
            console.log(user.facebook);
            console.log(profile.displayName+" has logged in with e-mail id : "+ profile.emails)
            //name is made as global so that it can be accessible from other files and can be rendered to the jade template :)
              global.name=profile.displayName;
          //console.log("welcome "+ user.username+user.first_name);
          global.fbid=user.facebookId;
          global.gender=profile.gender;
          global.firstname=profile.name.givenName;
          global.lastname=profile.name.familyName;
              
              return done(null,user);
        } 
        else{
          
          //updating and overwriting the user's data , if changed 
          user = new User
                ({
                  provider: 'facebook',
                  facebook: profile._json,
                  username:profile.displayName,
                  email:profile.emails,
                  facebookId:profile.id
              
                })
          
          global.name=profile.displayName;
          console.log(user);
          console.log(profile);
          console.log(user.facebookId);
    
          global.fbid=user.facebookId;
          global.gender=profile.gender;
          global.firstname=profile.name.givenName;
          global.lastname=profile.name.familyName;
          return done(null,user);
        }
      })
    }))
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
      User.findById(id).then(function(user)
    {
      done(null,user)
    }
    )
    })
}
