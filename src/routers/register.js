const express = require('express')
const User = require('../models/user.js')
const adminAuth = require('../middlewares/adminAuth')

const router = new express.Router()

router.get('/register', adminAuth, (req, res) => {
    res.render('register', {error: req.query.error, auth: req.query.auth})
})

router.post('/register', async (req, res) => {
    const user = new User({
        name: req.body.username,
        email: req.body.email,
        mobile: "9876577333",
        isHead: false,
        isOnLeave: false,
        password: req.body.password,
        gender: req.body.gender,
        designation: req.body.designation,
        department: req.body.department
    })

    try {
        const token = await user.generateAuthToken()
        res.redirect('/register')
    }
    catch (e) {
        res.redirect('/register?error=1')
    }
})

module.exports = router