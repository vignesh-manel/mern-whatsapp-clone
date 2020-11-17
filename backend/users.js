const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    pnum: {type: Number, unique: true},
    password: String,
    displayName: String
});

module.exports = mongoose.model('users',userSchema)
