const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
    const token = req.headers.token
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                res.status(400).json('token is not valid')
            } else {
                req.user = user
                next()
            }
        })
    } else {
        res.status(400).json('you are not logged in !')
    }
}
module.exports = verify