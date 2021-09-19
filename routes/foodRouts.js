const router = require('express').Router()
const Food = require('../models/foods')
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken')
const verify = require('../verify');


//get by serach and pagination
router.post("/", async (req, res) => {
    if ((req.body.searched)?.length) {
        try {
            const search = req.body.searched

            const foods = await Food.find(
                {
                    $or:
                        [{ "name": { $regex: search, $options: 'i' } },
                        { "type": { $regex: search, $options: 'i' } }]
                }).skip(req.body.skip).limit(6)

            res.status(200).json(foods)
        } catch {
            res.status(500).json("sth went wrong")
        }
    } else {
        try {
            const foods = await Food.find().skip(req.body.skip).limit(6)
            res.status(200).json(foods)
        } catch (err) {
            res.status(500).json("not found")
        }
    }


})


//get by id
router.get('/:id', async (req, res) => {
    try {
        const food = await Food.findById(req.params.id)
        res.status(200).json(food)
    } catch (err) {
        res.status(500).json(err)
    }
})
//newFood
router.post('/newFood', verify, async (req, res) => {
    if (req.user.isAdmin) {

        const newFood = new Food({
            type: req.body.type,
            name: req.body.name,
            pic: req.body.pic,
            price: req.body.price,
            madeFrom: req.body.madeFrom
        })
        try {
            const saved = await newFood.save()
            res.status(200).json(saved)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json('you are not allowd')
    }

})
//rate
router.put('/rate/:id', verify, async (req, res) => {

    try {
        const food = await Food.findById(req.params.id)

        const hasRate = food.rates.map(rate =>
            req.user.id === rate.rater ? true : false)

        if (hasRate[0]) {
            res.status(400).json('you already has gave rate')
        }

        if (!hasRate[0]) {
            await food.rates.push({ rate: req.body.rate, rater: req.user.id })
            const saved = await food.save()
            res.status(200).json(saved)
        }
    } catch (err) {
        res.status(500).json(err)
    }
})
//comment
router.put('/comment/:id', verify, async (req, res) => {
    try {
        const food = await Food.findById(req.params.id)

        const hasComment = food.comments.filter(comment =>
            comment.commenter === req.user.id)

        if (hasComment[0]) {
            console.log(req.user)
            res.status(400).json('you already has left a comment  for this food')
        }

        if (!hasComment[0]) {
            const h = new Date()

            await food.comments.push({
                comment: req.body.comment, commenter: req.user.id,
                name: req.user.name, h: { year: h.getFullYear(), month: h.getMonth(), day: h.getDay(), hour: h.getHours(), min: h.getMinutes() }
            })
            const saved = await food.save()
            res.status(200).json('youre comment added')
        }
    } catch (err) {
        res.status(500).json(err)
    }
})
//deleteComment
router.delete('/deleteComment/:food', verify, async (req, res) => {
    if (req.body.commenter === req.user.id || req.user.isAdmin) {
        try {
            const food = await Food.findById(req.params.food)

            const newcomments = await food.comments.filter(c => c.commenter !== req.body.commenter)
            food.comments = newcomments
            const saved = await food.save()
            res.status(200).json(saved)

        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json("you are not allowed")
    }
})

module.exports = router