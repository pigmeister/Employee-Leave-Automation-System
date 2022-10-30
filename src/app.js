require('./db/mongoose')
const express = require("express")
const path = require('path')
const cookieParser = require('cookie-parser')
const registerRouter = require('./router/register')
const PORT = process.env.PORT
const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://nipuntopno:Nipun123@cluster0.ydchfxl.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    // useFindAndModify:true,
    useUnifiedTopology:true
    // useCreateIndex:true
})

const app = express()
app.set('view engine', 'ejs')

//views folder
app.set('views', path.join(__dirname,'../template/views'))

//public folder
app.use(express.static(path.join(__dirname, '../public')))

//cookie parser
app.use(cookieParser())

//body parser
app.use(express.urlencoded({ extended: false }))

app.use(registerRouter)

app.listen(3000, () => {
    console.log('Server is up!~')
})