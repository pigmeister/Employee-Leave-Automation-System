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
    let leave;

    leave = await Leave.find({status:"recommended"})
    leave = leave.concat(await Leave.find({status:"pending"}))

    res.render("leaves.ejs",{leaves:leave})
})

router.post('admin/leave',auth,async(req,res)=>{

})

module.exports = router

