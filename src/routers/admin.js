const express = require('express')
const auth = require('../middlewares/adminAuth')
const Leave = require('../models/leave')
const User = require('../models/user')
const router = new express.Router()
// const moment = require('moment')

router.get('/admin', auth, (req, res) => {
    res.render("home", {home: 3})
})

router.get('/admin/leave', auth, async (req, res) => {
    let leave

    leave = await Leave.find({status:"recommended"})
    // leave = leave.concat(await Leave.find({status:"pending"}))

    res.render("adminLeaves.ejs", {leaves: leave})
})

router.post('/admin/leave', auth, async(req, res) => {

    try {    
        var leave = await Leave.findOne({_id: req.body._id})

        if (req.body.status == 'Approve') {
            leave.status = 'approved'

            user = req.user

        }
        else {
            leave.status = 'rejected'
            await leave.save() // send down after approved is complete
        }
    }
    catch (e) {
        console.log(e)
    }

    res.redirect('/admin/leave')
})

module.exports = router

