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
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    visitDuration: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    openingHours: {
        type: String,
        required: true
    },
    location: {
        category: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    },
    attractions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attraction'
    }]
}, { timestamps: true });

// Slug oluşturma middleware
citySchema.pre('save', function (next) {
    if (!this.slug || this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('City', citySchema);
