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
    
})

module.exports = router

