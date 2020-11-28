const mongoose = require('mongoose')

const roomSchema = mongoose.Schema({
    pnum: Number,
    name: String,
    user: Number,
    imageUrl: String
});

module.exports = mongoose.model('chatrooms',roomSchema)
