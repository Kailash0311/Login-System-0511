var mongoose = require('mongoose');
var url='mongodb://localhost:27017/user1'
 var db
 var Schema = mongoose.Schema;
 var UserSchema = new Schema(
   {
   googleId: Number,
   username:String,
   email: Object,
   gender: String,
   bday:String,
   photo:String,
 
 });
 
 var User = mongoose.model('gUser', UserSchema);
 var gUserfile=mongoose.model('gUserfile',{
  googleId:Number,
  filename:String,
  filetype:String,
  filesize:String    
 })
 module.exports=User;