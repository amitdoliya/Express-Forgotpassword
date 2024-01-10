const express=require('express')//function
const app=express()//module
app.use(express.urlencoded({extended:false}))
const frontendRouter=require('./routers/frontend')
const adminRouter=require('./routers/admin')
const mongoose=require('mongoose')
const session=require('express-session')
mongoose.connect('mongodb://127.0.0.1:27017/5pmexpressprojectrevision')
  




app.use(session({
secret:'ravi',
Cookie:{maxAge:1},
resave:false,
saveUninitialized:false
}))
 
app.use(frontendRouter)
app.use('/admin',adminRouter)
app.use(express.static('public'))
app.set('view engine','ejs')
app.listen(5000)