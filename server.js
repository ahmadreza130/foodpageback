const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require("compression")
const foodRouts = require('./routes/foodRouts')
const userRoute = require('./routes/userRouts')
const regRoute = require('./routes/register&login')

dotenv.config()
const app = express();
mongoose.connect("mongodb+srv://ahmad:ahmad@cluster0.22ioe.mongodb.net/fatsfood?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => console.log('connected to db')).catch(err => console.log('db connction faild error:', err))

app.use(compression())
app.use(cors())
app.use(express.json())
app.use('/user', regRoute)
app.use('/user', userRoute)
app.use('/foods', foodRouts)

app.listen(process.env.PORT || 8080, () => console.log('server on'))