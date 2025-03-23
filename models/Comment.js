const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema); 