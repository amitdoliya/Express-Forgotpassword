const mongoose=require('mongoose')


const testSchema=mongoose.Schema({
img:String,
testi:String,
cname:String,
Status:{type:String,default:'unpublish'}
})

module.exports=mongoose.model('testi',testSchema)