require('./db/mongoose')
const express = require("express")
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const path = require('path')
const cron = require('node-cron')
const User = require('./models/user')
const Leave = require('./models/leave')
const registerRouter = require('./routers/register')
const loginRouter = require('./routers/login')
const midadminLoginRouter = require('./routers/midadminLogin')
const midadminRouter = require('./routers/midadmin')
const adminLoginRouter = require('./routers/adminLogin')
const logoutRouter = require('./routers/logout')
const leaveFormRouter = require('./routers/leaveForm')
const adminRouter = require('./routers/admin')

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
app.use(adminLoginRouter)
app.use(logoutRouter)
app.use(leaveFormRouter)
app.use(midadminLoginRouter)
app.use(midadminRouter)
app.use(adminRouter)

// Scheduled tasks
cron.schedule('1 0 0 * * *', async () => {
    var currentTimestamp = new Date().getTime()
    currentTimestamp += (330 * 60 * 1000)
    const today = new Date(currentTimestamp)

    const users = await User.find({})

    for (var user of users) {

        const leaves = await Leave.find({userID: user._id, status: 'approved', startTime: {$lte: today}, endTime: {$gte: today}})
        if (leaves.length > 0) {
            user.isOnLeave = true
        }
        else {
            user.isOnLeave = false
        }
        
        await user.save()
    }

    const allLeaves = await Leave.find({status: {$in: ['recommended', 'pending']}, startTime: {$lte: today}})
    for (var leave of allLeaves) {

        leave.status = 'rejected'
        await leave.save()
    }

}, {
    scheduled: true
    // timezone: "Asia/Kolkata"
})

app.listen(process.env.PORT, () => {
    console.log('Server is up!~')
})