const express = require('express')
const User = require('../models/user.js')
// const unauth = require('../middlewares/unauth')

const router = new express.Router()

router.get('/register', (req, res) => {
    res.render('register', {error: req.query.error, auth: req.query.auth})
})

router.post('/register', async (req, res) => {
    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        post: req.body.designation,
        leavesLeft: 0
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