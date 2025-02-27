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
    content: String,
    populerFoods: String,
    description: String,
    imageUrl: String,
    googleMapsUrl: String,
    
}, { timestamps: true });

// Slug oluşturma middleware
citySchema.pre('save', function (next) {
    if (!this.slug || this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('City', citySchema);
