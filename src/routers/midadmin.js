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
    let leave;

    if(req.user.position=='DEAN' || req.user.position=='DIRECTOR')
        leave=await Leave.find({status:"pending"}).sort({startTime:'asc'})
    else if(req.user.position=='HOD')
        leave=await Leave.find({status:"pending",department:req.user.department}).sort({startTime:'asc'})
    else
        leave=await Leave.find({status:"pending",department:"NF"}).sort({startTime:'asc'})

    res.render("leaves.ejs",{leaves:leave})
})

router.post('midadmin/leave',auth,async(req,res)=>{

})

module.exports = router

