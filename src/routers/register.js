const express = require('express')
const User = require('../models/user.js')
const unauth = require('../middlewares/unauth')

const router = new express.Router()

router.get('/register', unauth, (req, res) => {
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
        res.cookie('auth_token', token)
        res.redirect('/user')
    }
    catch (e) {
        res.redirect('/register?error=1')
    }
})

module.exports = router