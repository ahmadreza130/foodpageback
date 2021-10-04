const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    type: { required: true, type: String },
    name: { required: true, type: String, unique: true },
    pic: { required: true, type: String },
    price: { required: true, type: Number },
    madeFrom: { required: true, type: String },
    rates: { type: Array },
    comments: { type: Array }
}, { timestamps: true });
foodSchema.index({name: 'text',type:"text"});
module.exports = mongoose.model('Food', foodSchema)

