const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
    const token = req.headers.token
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                res.status(200).json('token is not valid')
            } else {
                req.user = user
                next()
            }
        })
    } else {
        res.status(200).json('you are not logged in !')
    }
}
module.exports = verify