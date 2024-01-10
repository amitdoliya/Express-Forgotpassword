const Banner=require('../models/banner')


 exports.bannerInsert=async(req,res)=>{
   req
 }

exports.bannerShow=async(req,res)=>{
      const record=await Banner.findOne()
     res.render('banner.ejs',{record ,username:'hello'})
 
}
exports.bannershowadmin=async(req,res)=>{
      const record=await Banner.findOne()
       res.render('admin/banner.ejs',{record })
  }
exports.bannerupdateform=async(req,res)=>{
      const id=req.params.abc
      //console.log(req.params.abc)
      //console.log(req.body)
    const record=await Banner.findById(id)
     res.render('admin/bannerform.ejs',{record })
  }
exports.bannerupdateadmin=async(req,res)=>{
     const id=req.params.abc
      // console.log(req.params.abc)
      // console.log(req.body)
        const{title,desc,ldesc}=req.body
        if(req.file){
          const imgename=req.file.filename
     await Banner.findByIdAndUpdate(id,{title:title,desc:desc,ldesc:ldesc,img:imgename})
        }
        else{
          await Banner.findByIdAndUpdate(id,{title:title,desc:desc,ldesc:ldesc})
        
        }
      res.redirect('/admin/banner')
        
      }
      