const Reg=require('../models/reg')
const nodemailer=require('nodemailer')




exports.regshow=(req,res)=>{
  let sess=req.session.isAuth
      if(sess!==null){
        res.render('reg.ejs',{username:sess})
      }else{
        res.render('reg.ejs',{username:'hello'})
      }
        
            
        }
        exports.reginsert=async(req,res)=>{
            const  {us,pass}=req.body
            const checkuser=await Reg.findOne({username:us})
            if(checkuser==null){
             const record =new Reg({username:us,password:pass})
              await record.save()
              res.redirect("/login")
            }else{
             res.send("Your name already exist")
            }
             // console.log(record)
         }
         exports.regshowadmin=async(req,res)=>{
            const record=await Reg.find().sort({createdDate:-1})
                res.render('admin/reg.ejs',{record})
          }
          // exports.regupdateadmin=async(req,res)=>{
          //   const id=req.params.id
          //   //console.log(req.params.id)
          //   const record=await Reg.findById(id)
          //   let newstatus=null
          //   if(record.status=='active'){
          //       newstatus='suspended '
        
          //   }else{
          //       newstatus='active'
          //   }
          //   await Reg.findByIdAndUpdate(id,{status:newstatus})
          //   res.redirect('/admin/reg')
          //     }
              exports.regdeleteadmin=async(req,res)=>{
                  const id=req.params.id
                  await Reg.findByIdAndDelete(id)
                  res.redirect('/admin/reg')
                    }
            
            exports.forgotshow=(req,res)=>{
                   res.render("forgotform.ejs")

            }
            exports.forgotlink=(req,res)=>{
                  const email=req.params.email
                  res.render('forgotlink.ejs',{username:"hello",email})
            }
            exports.forgotpasswordupdate=async(req,res)=>{
               
                    const email=req.params.email
                
                const record=await Reg.findOne({email:email})
                console.log(record)
                        const id=record.id
                       const{npasss}=req.body
                   console.log(id,npasss)
                 await Reg.findByIdAndUpdate(record.id,{password:npasss})
                 res.render('login.ejs',{message:'Your password has been changed ,please do fresh login',username:'hello'})
             }


             


        
            exports.forgotdata=async(req,res)=>{
              const {email}=req.body
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
            to: email,// list of receivers
            subject:'password Change Link', // Subject line
            html:`<a href=http://localhost:5000/changepassword/${email}>click to verify,</a>`//html body
});
     res.send('Password link has been sent to your registered email Id ')
            }
            exports.forgotmessage=(req,res)=>{
              res.send("Password change link sent to your Email")
             }