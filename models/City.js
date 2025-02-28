const mongoose = require('mongoose');
const slugify = require('slugify');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    content: String,
    populerFoods: String,
    description: {
        type: String,
        required: true
    },
    imageUrl: String,
    googleMapsUrl: String,
    
}, { timestamps: true });

const City = mongoose.model('City', citySchema);
module.exports = City;
