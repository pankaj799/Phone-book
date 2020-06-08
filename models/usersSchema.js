const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: { unique: true }
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    passwd: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date
});


module.exports = mongoose.model('User', usersSchema);
