const router = require('express').Router()
const User = require('../models/users')
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken')

//register
router.post('/register', async (req, res) => {
    const allUsers = await User.find()
    const isornot = allUsers.filter(u => u.email === req.body.email)
    if (isornot.length) {
        return res.status(400).json("this email is already registered")
    } else {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
            ).toString(),
            address: req.body.address
        })
        try {
            const user = await newUser.save();
            res.status(201).json(user)
        } catch (err) {
            res.status(500).json(err)
        }
    }
})

//login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            email: { $eq: req.body.email }
        })
        if (!user) {
            return (res.status(400).json('wrong email or password'))

        }

       
        if (req.body.password === user.password) {

            const accessToken = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin, name: user.name },
                process.env.SECRET_KEY,
                { expiresIn: "3d" }
            );

            const { password, ...info } = user._doc
            res.status(200).json({ ...info, accessToken })
        } else {
            res.ststus(400).json('wrong email or password')
        }
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router
