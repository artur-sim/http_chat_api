const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userShema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    messages: {
        incomming: [{
            type: String
        }],
        outcomming: [{
            type: String
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('user', userShema);