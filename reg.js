const mongoose=require('mongoose')


const regSchema=mongoose.Schema({
    username:String,
    password:String,
    firstName:String,
    lastName:String,
    email:String,
    img:String,
   
    status:{type:String,default:'suspended'},
    createdDate:{type:Date,default:new Date()},
    role:{type:String,default:'public'}
    
   
})
   





    
module.exports=mongoose.model('reg',regSchema)