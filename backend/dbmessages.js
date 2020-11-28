const mongoose = require('mongoose')

const whatsappSchema = mongoose.Schema({
    fromRoomId: String,
    toRoomId: String,
    message: String,
    name: String,
    timestamp: String,
});

module.exports = mongoose.model('messagecontents',whatsappSchema)
