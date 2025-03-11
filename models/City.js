const mongoose = require('mongoose');
const slugify = require('slugify');

const citySchema = new mongoose.Schema({
    name: String,
    slug: String,
    description: String,
    imageUrl: String,
    countryId: mongoose.Schema.Types.ObjectId,
    famousDishes: [{
        name: String,
        imageUrl: String
    }]
});

module.exports = mongoose.model('City', citySchema);
