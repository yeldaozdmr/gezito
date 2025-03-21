const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 370
    },
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment; 