const mongoose = require('mongoose');
const slugify = require('slugify');

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    flagUrl: {
        type: String,
        required: true
    },
    description: String,
    capital: String,
    population: Number,
    area: Number,
    cities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    }]
});

countrySchema.pre('save', function(next) {
    if (!this.slug || this.isModified('name')) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            locale: 'tr'
        });
    }
    next();
});

module.exports = mongoose.model('Country', countrySchema); 