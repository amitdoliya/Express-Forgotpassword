const router=require('express').Router()
const cbanner=require('../controllers/bannercontroller')
const creg=require('../controllers/regcontroller')
const Banner=require('../models/banner')
const Query=require('../models/query')
const Services=require('../models/service')
const multer=require('multer')
const nodemailer=require('nodemailer')
const Testi=require('../models/testi')
const Reg=require('../models/reg')
const parking = require('../models/parking')
const banner = require('../models/banner')


let sess=null;

function handlelogin(req,res,next){
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/login')
    }
}
function handlerole(req,res,next){
    if(sess.role=='public'){
        next()
    }else{
        res.send("You dont have right to see this pages")
    }
}



let storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/upload")
    },
    filename:function(req,file,cb){
        cb(null ,Date.now()+file.originalname)
    }
})

let upload=multer({
    storage:storage,
    limits:{fileSize:1024*1024*4}
})



router.get('/',handlelogin,async(req,res)=>{
    const record=await Banner.findOne()
     console.log("record123",record)
    const servicesdata=await Services.find({status:'publish'})
    const testidata=await Testi.find({Status:'publish'})
    // console.log(testidata)
  //console.log(sess.username)
if(sess!==null){
    res.render("index.ejs",{record,servicesdata,testidata,username:sess.username})
}else{
    res.render("index.ejs",{record,servicesdata,testidata,username:'hello'})
}

})
router.get('/banner',handlelogin,cbanner.bannerShow)
router.post('/queryrecord', async(req,res)=>{
    const{email,query}=req.body
     const record=new Query({email:email,query:query,status:'unread'}) 
       await record.save()
       res.redirect('/')
       //console.log(record)

    })
    router.get('/testi',handlelogin,(req,res)=>{
       if(sess!=null){
         res.render('testi.ejs',{username:sess.username})
       }else{
        res.render('testi.ejs',{username:'hello'})
      }
    
    })
    router.post('/testirecords',upload.single('img'),async(req,res)=>{
         console.log("req.body",req.body)
        const imagename=req.file.filename
       const{qt,cname}=req.body 
       const record=new Testi({img:imagename, testi:qt,cname:cname,Status:'unpublish'})
       await record.save()
     res.redirect('/')
      //console.log(record)
       })
       router.get('/servicedetail/:id',handlelogin, async(req,res)=>{
        const id=req.params.id
       const record=await Services.findById(id)
        res.render('servicedetail.ejs',{record,username:'hello'})
    })
    router.get('/reg',creg.regshow)
  
    router.post('/regrecords',creg.reginsert)
    router.get('/login',(req,res)=>{
        if(sess!==null){
            
            res.render('login.ejs',{message: '',username:sess.username})
        }else{
            res.render('login.ejs',{message:'',username:'hello'})
        }
        })
    router.post('/loginrecords',async(req,res)=>{
        const {us,Pass}=req.body
       const record=await Reg.findOne({username:us})
        console.log("record",record)
       if(record!==null&&record.status=='active'){
      if(record.password==Pass){
        
        req.session.isAuth=true
        sess=req.session
        sess.username=us
        sess.role=record.role
        res.redirect('/')
          
           }else{
           if(sess!==null){
            res.render('login.ejs',{message:'! Wrong Credentails',username:sess.username})
        }else{
            res.render('login.ejs',{message:'! Wrong Credentails',username:'hello'})
        }
    }
         }else{
            if(sess!==null){
                res.render('login.ejs',{message:'! Wrong credentails',username:sess.username})
            }else{
                res.render('login.ejs',{message:'! Wrong credentails',username:'hello'})
            }
           
        }
    })
    router.get('/logout',(req,res)=>{
        req.session.destroy()
        sess=null
        res.redirect('/login')
    })
    router.get('/profile',handlelogin,async(req,res)=>{
        if(sess!==null){
        const record=await Reg.findOne({username:sess.username})
        res.render("profile.ejs" ,{message:'',record,username:sess.username})
        }else{
            res.render("profile.ejs" ,{message:'',username:'hello'})
        }
    
    })
    router.post('/profile/:id',upload.single('img'),async(req ,res)=>{
       const id=req.params.id
        const{fname,lname,email}=req.body
      //console.log(req.body)
      if(req.file){
        const imgfilename=req.file.filename
      await Reg.findByIdAndUpdate(id,{ firstName:fname,lastName:lname, email:email,img:imgfilename})
    
      }else{
        await Reg.findByIdAndUpdate(id,{ firstName:fname,lastName:lname, email:email})
      }
      if(sess!==null){
        const record=await Reg.findOne({username:sess.username})
        res.render("profile.ejs" ,{message:'Profile has been updated',record,username:sess.username})
        }else{
            res.render("profile.ejs" ,{message:'Profile has been updated',username:'hello'})
        }
    
    })
    router.get('/password',handlelogin,(req,res)=>{
        if(sess!==null){
        res.render('password.ejs',{username:sess.username})
        }
    })
    router.post('/password',handlelogin,async(req,res)=>{
        const {cpass,npass}=req.body
        const record=await Reg.findOne({username:sess.username})
        if(record.password==cpass){
            const id=record.id
            await Reg.findByIdAndUpdate(id,{password:npass})
            res.redirect('/password')
        }else{
            res.send("current password not matched")
        }

    })
    // router.post("/searchrecords",async(req ,res)=>{
    //          console.log(req.body)
     // const {search} =req.body
 
        //const record = await  parking.find({vin:search })
            
          
      
       // res.redirect('/parking.ejs')
         
          
             
    // })
    router.get("/forgotpassword",creg.forgotshow)
    router.post("/forgotpassword",creg.forgotdata)
    router.get('forgotmessage',creg.forgotmessage)
    router.get('/changepassword/:email',creg.forgotlink)
    router.post('/forgotpasswordnew/:id',creg.forgotpasswordupdate)
    

     
      
    








module.exports=router