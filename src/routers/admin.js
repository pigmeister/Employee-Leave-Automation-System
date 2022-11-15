const express = require('express')
const auth = require('../middlewares/adminAuth')
const Leave = require('../models/leave')
const User = require('../models/user')
const router = new express.Router()
// const moment = require('moment')

router.get('/admin', auth, async (req, res) => {
    
    const users = await User.find({})

    res.render("admin", {users: users})
})

router.get('/admin/leave', auth, async (req, res) => {
    let leave

    leave = await Leave.find({status: "recommended", takenCharge: true, approvedByAdmin: false})
    
    var inCharge = {}
    for (var e of leave) {
        const replacement = await User.findOne({_id: e.replacement})
        inCharge[e._id] = {
                            name: replacement.name,
                            startDate: e.startTime.toUTCString().slice(5, 16),
                            endDate: e.endTime.toUTCString().slice(5, 16)
                        }
    }

    res.render("adminLeaves.ejs", {leaves: leave, inCharge: inCharge})
})

router.post('/admin/leave', auth, async(req, res) => {

    try {    
        var leave = await Leave.findOne({_id: req.body._id})

        var startTimeStamp = leave.startTime.getTime()
        var endTimeStamp = leave.endTime.getTime()
        var daysCount = parseInt((endTimeStamp - startTimeStamp) / (1000 * 60 * 60 * 24)) + 1

        if (req.body.status == 'Approve') {

            leave.approvedByAdmin = true

            if (leave.approvedByMidadmin == true) {
                leave.status = 'approved'

                const user = await User.findOne({_id: leave.userID})
                console.log(user)
                if (leave.leaveType === 'Casual Leave') {
                    user.leavesLeft.cl -= daysCount
                }
                if (leave.leaveType === 'Restricted Holiday') {
                    user.leavesLeft.rh -= daysCount
                }
                if (leave.leaveType === 'Earn Leave') {
                    user.leavesLeft.el -= daysCount
                }
                if (leave.leaveType === 'Half Pay Leave') {
                    user.leavesLeft.hpl -= daysCount
                }
                if (leave.leaveType === 'Vacation Leave') {
                    user.leavesLeft.el -= daysCount / 2.0
                }
                
                await user.save()
            }

        }
        else {
            leave.status = 'rejected'
        }
        
        await leave.save()
    }
    catch (e) {
        console.log(e)
    }

    res.redirect('/admin/leave')
})

module.exports = router

