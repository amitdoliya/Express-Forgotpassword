const Parking = require('../models/parking')



exports.parkingshow=async(req,res)=>{
      const record= await Parking.find()
       res.render('admin/parking.ejs',{record})
}
exports.parkingform=(req,res)=>{
     res.render('admin/parkingform.ejs')
      }

exports.parkinginsert=async(req,res)=>{
     const {vno,vtype,vin}=req.body
   const record=new Parking({vno:vno,vtype:vtype,vin:vin})
   await record.save()
   //console.log(record)
    res.redirect('/admin/parking')
}
exports.parkingupdateform=async(req,res)=>{
      const id=req.params.id
        const record= await Parking.findById(id)
      res.render('admin/parkingupdateform.ejs',{record}) 
}
exports.parkingupdate=async(req,res)=>{
const id=req.params.id
const vout=new Date()
  const record=await Parking.findById(id)
  const totaltime=(vout-record.vin)/(1000*60*60)
  //console.log(totaltime)  
  let amount=0
  if(record.vtype=='2w'){
     amount=Math.round(totaltime*30)
  }else if(record.vtype=='3w'){
      amount=Math.round(totaltime*50)
  }else if(record.vtype=='4w'){
      amount=Math.round(totaltime*80)
  }else if(record.vtype=='hw'){
      amount=Math.round(totaltime*100)
  }else if(record.vtype=='lw')
     amount=Math.round(totaltime*120)
     await Parking.findByIdAndUpdate(id,{vout:new Date(),amount:amount,status:'OUT'})  
     res.redirect('/admin/parking')
    }
     // amount=Math.round(amount)
 exports.parkingprint=async(req,res)=>{
    const id =req.params.id
const record =await Parking.findById(id)
res.render('admin/print.ejs',{record})
 }
//  exports.parkingsearch=async(req,res)=>{
//     const id=req.params.id
//      const {search}=req.body
//     const record =await Parking.find({status:search})
//     res.render('admin/parking.ejs',{record})
//  }
 

