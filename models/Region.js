const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['country', 'city'],
        required: true
    }
});

module.exports = mongoose.model('Region', regionSchema); 