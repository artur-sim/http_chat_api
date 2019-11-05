const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userShema = new Schema({
    msg: {
        type: String,
    },
    sender: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('chatMessage', userShema);