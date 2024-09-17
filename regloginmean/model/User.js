const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocal=require('passport-local-mongoose');

var User=new Schema({
    email:{type:String},
    password:{type:String}
})

User.plugin(passportLocal);
module.exports=mongoose.model('User',User);
