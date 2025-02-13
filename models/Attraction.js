const mongoose = require('mongoose');
const slugify = require('slugify');

const attractionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    visitDuration: String,
    price: {
        type: String,
        default: 'Ücretsiz'
    },
    openingHours: String,
    category: {
        type: String,
        enum: ['tarihi', 'müze', 'park', 'dini', 'alışveriş', 'eğlence']
    },
    type: {
        type: String,
        enum: ['historical', 'natural', 'cultural', 'entertainment'],
        required: true
    }
});

attractionSchema.pre('save', function(next) {
    if (!this.slug || this.isModified('name')) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true
        });
    }
    next();
});

module.exports = mongoose.model('Attraction', attractionSchema); 