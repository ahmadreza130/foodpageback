const router = require('express').Router()
const User = require('../models/users')
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken')
const verify = require('../verify');

//getAll
router.get('/users', verify, async (req, res) => {
    if (req.user.isAdmin) {

        try {
            const allusers = await User.find()
            res.status(200).json(allusers)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json('you are not allowd')
    }

})
//update
router.put('/update/:id', verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
            ).toString()

        }

        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            res.status(200).json(updatedUser)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json('you are not allowd')
    }

})
router.put('/addToCurrunOrder/:id', verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {

        try {
            const user = await User.findById(req.params.id)

            user.curruntOrder.push(req.body.order)

            const saved = await user.save()
            res.status(200).json("cooking started")
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json('you are not allowd')
    }

})
//movefood to cartHistory
router.put('/moveToCartHistory/:id', verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const user = await User.findById(req.params.id)
            const currunt = user.curruntOrder
            user.curruntOrder = []
            user.cartHistory.push(currunt)
            const saved = await user.save()
            res.status(200).json(saved)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json('you are not allowed')
    }

})
//delete
router.delete('/deleteAccount/:id', verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {

        try {
            const deletedone = await User.findByIdAndDelete(req.params.id)
            res.status(200).json(deletedone)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json('you are not allowd')
    }

})


module.exports = router