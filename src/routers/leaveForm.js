const express = require('express')
const auth = require('../middlewares/auth')
const Leave = require('../models/leave')

const router = new express.Router()

router.get('/leave',auth,(req,res)=>{

    res.render('leaveForm',{user:req.user})
})

module.exports = router