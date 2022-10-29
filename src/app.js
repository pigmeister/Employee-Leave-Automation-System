require('./db/mongoose')
const express = require("express")
const path = require('path')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT

const app = express()
app.set('view engine', 'ejs')

//views folder
app.set('views', path.join(__dirname,'../template'))

//public folder
app.use(express.static(path.join(__dirname, '../public')))

//cookie parser
app.use(cookieParser())

//body parser
app.use(express.urlencoded({ extended: false }))

app.listen(PORT, () => {
    console.log("Server is up!")
})