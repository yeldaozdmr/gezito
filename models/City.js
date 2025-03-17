const mongoose = require('mongoose');
const slugify = require('slugify');

const citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    description: String,
    slug: { type: String, unique: true },
    imageUrl: String,
    famousDishes: [{
        name: String,
        imageUrl: String
    }]
});

module.exports = mongoose.model('City', citySchema);
