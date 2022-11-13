const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String, required: true, unique: true
    }, password: {
        type: String, required: true
    }, ownedBooks: [{
        _id: String, volumeInfo: {
            title: String, authors: [String]
        },
        isBorrowedTo: String,
    }]
});

module.exports = mongoose.model('User', userSchema);
