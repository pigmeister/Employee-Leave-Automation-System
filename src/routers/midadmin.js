const express = require('express')
const auth = require('../middlewares/midadminAuth')
const Leave = require('../models/leave')
const User = require('../models/user')
const router = new express.Router()
// const moment = require('moment')

router.get('/midadmin', auth, (req, res) => {
    res.render("home", {home: 3})
})

router.get('/midadmin/leave', auth, async (req, res) => {
    let leave

    if(req.user.position=='DEAN' || req.user.position=='DIRECTOR') {
        leave = await Leave.find({status:"pending"}).sort({startTime:'asc'})
    }
    else if(req.user.position=='HOD') {
        leave = await Leave.find({status:"pending", department:req.user.department}).sort({startTime:'asc'})
    }   
    else {
        leave = await Leave.find({status:"pending", department:"NF"}).sort({startTime:'asc'})
    }

    var inCharge = {}
    for (var e of leave) {
        const replacement = await User.findOne({_id: e.replacement})
        inCharge[e._id] = {
                            name: replacement.name,
                            startDate: e.startTime.toUTCString().slice(5, 16),
                            endDate: e.endTime.toUTCString().slice(5, 16)
                        }
    }

    res.render("midadminLeaves.ejs", {leaves: leave, inCharge: inCharge})
})

router.post('/midadmin/leave', auth, async(req, res) => {

    try {    
        var leave = await Leave.findOne({_id: req.body._id})

        if (req.body.status == 'Recommend') {
            leave.status = 'recommended'
            leave.recommendedBy = req.user.position
            if (req.user.position == 'HOD') {
                leave.recommendedBy = 'HOD ' + req.user.department
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

    res.redirect('/midadmin/leave')
})

module.exports = router

