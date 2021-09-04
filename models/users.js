const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: { required: true, type: String },
    email: { required: true, type: String, unique: true },
    password: { required: true, type: String },
    profile: { type: String },
    address: {  type: String },
    cartHistory: { type: Array },
    curruntOrder: { type: Array },
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema)
