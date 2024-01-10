
const mongoose=require('mongoose')


const parkingSchema=mongoose.Schema({
      vno:String,
      vtype:String,
      vin:{type:Date,default:new Date()},
      vout:{type:Date,default:0},
      amount:{type:Number,default:0},
      status:{type:String,default:'IN'}

})






module.exports= mongoose.model('parking', parkingSchema)