const router=require('express').Router()
const cbanner=require('../controllers/bannercontroller')
const creg=require('../controllers/regcontroller')
const cparking=require('../controllers/parkingcontroller')
const Adminreg=require('../models/adminreg')
const Banner=require('../models/banner')
const Query=require('../models/query')
const nodemailer=require('nodemailer')
const multer=require('multer')
const  Service=require ('../models/service')
const Testi=require('../models/testi')
const Reg=require('../models/reg')





let storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/upload")
    },
    filename:function(req,file,cb){
        cb(null , Date.now()+file.originalname)
    }
})

let upload=multer({
    storage:storage,
    limits:{fileSize:1024*1024*4}
})




 function handlelogin(req,res,next){
    if(req.session.isAuth){
        next()
    }
    else{
        res.redirect('/admin/')
    }
 }
router.get('/',(req,res)=>{
    res.render("admin/login.ejs")
})
router.post('/loginrecord',async(req,res)=>{
    const{us,pass}=req.body
    const record=await Adminreg.findOne({username:us})
    console.log("reacord", record)
   if(record!==null){
    if(record.password==pass){
        req.session.isAuth=true
    res.redirect('/admin/dashboard')
   }else{
    res.redirect('/admin/')
   }
}else{
    res.redirect('/admin/')
}
})
router.get('/dashboard',(req,res)=>{
    res.render('admin/dashboard.ejs')
})
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/admin/')
})


router.get('/banner',cbanner.bannershowadmin)
router.get('/bannerupdate/:abc',cbanner.bannerupdateform)
router.post('/bannerrecord/:abc',upload.single('img'),cbanner.bannerupdateadmin)

    router.get('/query',async(req,res)=>{
        const record=await Query.find()
        res.render('admin/query.ejs',{record})
    })
 
    router.get('/queryreply/:id',async(req,res)=>{
        const id=req.params.id
         const record= await Query.findById(id)
         console.log(record)
        // console.log(id)

        res.render('admin/queryform.ejs',{record})
         })
         router.post('/queryrecords/:id',upload.single('attachment'),async(req,res)=>{
         const filepath=req.file.path
         //console.log(req.file)
         const id=req.params.id
            const record=await Query.findById(id)
           const{emailto,emailfrom,sub,body}=req.body
         let testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
         let transporter = nodemailer.createTransport({
           host: "smtp.gmail.com",
           port: 587,
           secure: false, // true for 465, false for other ports
           auth: {
             user: 'rockstaramit675@gmail.com ',// generated ethereal user
             pass:'nfdomfaklrwyqovp', // generated ethereal password
           },
         });
         console.log('connect to smtp server')
        
         let info=await transporter.sendMail({
            from: 'rockstaramit675@gmail.com', // sender address
            to: record.email,// list of receivers
            subject:sub, // Subject line
            text:body, // plain text body
           //html: "<b>Hello world?</b>", // html body
          attachments:[
            {
                path:filepath
            }
          ]
          });
           

               await Query.findByIdAndUpdate(id,{status:'read'})
                res.redirect('/admin/query')
           
        
        })
         router.get('/querydelete/:id',async(req,res)=>{
            const id=req.params.id
      await Query.findByIdAndDelete(id)
            res.redirect('/admin/query')
         })
       router.get('/service',async(req,res)=>{
        const record=await Service.find().sort({posteddate:-1})
        const totalservices=await Service.count()
        const totalpublish=await Service.count({Status:'publish'})
        const totalunpublish=await Service.count({Status:'unpublish'})
     res.render('admin/service.ejs',{record,totalservices,totalpublish,totalunpublish})
       })
       router.get('/serviceadd',(req,res)=>{
        res.render('admin/serviceform.ejs')
       })
       router.post('/servicerecords',upload.single('img'),async(req,res)=>{
        const imgname=req.file.filename
        //console.log(req.body)
        const{stitle,sdesc,sldesc}=req.body
       const record=new Service({img:imgname,title:stitle,desc:sdesc,ldesc:sldesc,status:'publish',posteddate:new Date()
    })
       await record.save()
                                                                                            
       res.redirect('/admin/service')
    })
       router.get('/servicestatusupdate/:id',async(req,res)=>{
        const id=req.params.id
        const record=await Service.findById(id)
       // console.log(record)
        let newstatus=null
        if(record.status=='unpublish'){
            newstatus='publish'
        }else{
        newstatus='unpublish'
        }
        await Service.findByIdAndUpdate(id,{status:newstatus})
        res.redirect('/admin/service')               
      }) 
     router.get('/servicedelete/:id',async(req,res)=>{
        const id=req.params.id
        await Service.findByIdAndDelete(id)
        res.redirect('/admin/service')
     })
router.get('/testi',async(req,res)=>{
    const record= await Testi.find()
    res.render('admin/testi.ejs',{record})
})
router.get('/testidelete/:id',async(req,res)=>{
    const id=req.params.id
    await Testi.findByIdAndDelete(id)
    res.redirect('/admin/testi')
      })
      
      router.get('/testistatus/:id',async(req,res)=>{
        const id=req.params.id
        //   console.log(id)
        //      console.log(req.body)
        const record=await Testi.findById(id)
         //console.log(record)
        let newstatus=null
        if(record.Status=='publish'){
            newstatus='unpublish'
        }else{
              newstatus='publish'
        }
        await Testi.findByIdAndUpdate(id,{Status:newstatus})
        // console.log(Testi)
        res.redirect('/admin/testi')
      })

      router.get('/regupdate/:id',async(req,res)=>{
      
        const id=req.params.id
        //console.log(req.params.id)
        const record=await Reg.findById(id)
        //console.log(record)
        let newstatus=null
        if(record.status=='active'){
            newstatus='suspended'
        }else{
            newstatus='active'
        }
        await Reg.findByIdAndUpdate(id,{status:newstatus})
        res.redirect('/admin/reg')
       })






      router.get('/reg',creg.regshowadmin)
      //router.get('/regupdate/:id',creg.regupdateadmin)
      router.get('/regdelete/:id',creg.regdeleteadmin)
      router.get('/parking',cparking.parkingshow)
      router.get('/parkingform',cparking.parkingform)
      router.post('/parkingrecords',cparking.parkinginsert)
     
      router.get('/parkingupdaterecord/:id',cparking.parkingupdate)
      router.get('/print/:id',cparking.parkingprint)
    //   router.post('/parkingsearch/:abc',cparking.parkingsearch)
     

module.exports=router

