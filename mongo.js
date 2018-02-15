var mongoose = require('mongoose');
var url='mongodb://localhost:27017/user1'
 var db
 var Schema = mongoose.Schema;
 var UserSchema = new Schema(
   {
   facebookId: Number,
   username:String,
   facebook:Object,
   email: Object,
   gender: String,
   provider:String,
   bday:String,
   //photo:String
 
 });
 
 var User = mongoose.model('User', UserSchema);
 module.exports=User;