require('./db/mongoose')
const express = require("express")
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const path = require('path')
const registerRouter = require('./routers/register')
const loginRouter = require('./routers/login')
const logoutRouter = require('./routers/logout')

const app = express()
app.set('view engine', 'ejs')

//views folder
app.set('views', path.join(__dirname, '../templates/views'))

//public folder
app.use(express.static(path.join(__dirname, '../public')))

//cookie parser
app.use(cookieParser())

//body parser
app.use(express.urlencoded({ extended: false }))

app.use(registerRouter)
app.use(loginRouter)
app.use(logoutRouter)

app.listen(process.env.PORT, () => {
    console.log('Server is up!~')
})