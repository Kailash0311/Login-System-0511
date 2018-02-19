var mongoose = require('mongoose');
var url='mongodb://localhost:27017/user5'
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
   photo:String,
 
 });
 
 var User = mongoose.model('User', UserSchema);
 var Userfile=mongoose.model('Userfile',{
  facebookId:Number,
  filename:String,
  filetype:String,
  filesize:String    
 })
 module.exports=User;
 module.exports=Userfile;