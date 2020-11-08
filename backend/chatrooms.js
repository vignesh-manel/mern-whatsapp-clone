const mongoose = require('mongoose')

const roomSchema = mongoose.Schema({
    name: String
});

module.exports = mongoose.model('chatrooms',roomSchema)
