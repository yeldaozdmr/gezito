const mongoose = require('mongoose');
const slugify = require('slugify');

const citySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    countryId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Country', 
        required: true 
    },
    description: {
        type: String,
        trim: true
    },
    slug: { 
        type: String, 
        unique: true, 
        lowercase: true,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    famousDishes: [{
        name: String,
        imageUrl: String
    }]
}, { timestamps: true });

// Slug oluşturma middleware
citySchema.pre('save', function(next) {
    if (!this.isModified('name')) {
        return next();
    }
    
    try {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            locale: 'tr'
        });
        next();
    } catch (error) {
        next(error);
    }
});

// Güncelleme işlemlerinde de slug'ı otomatik oluştur
citySchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();
    if (update.name && !update.slug) {
        let baseSlug = slugify(update.name, {
            lower: true,
            strict: true,
            locale: 'tr'
        });
        update.slug = `${baseSlug}-gezilecek-yerler`;
        
        // Eğer aynı slug varsa, sonuna numara ekle
        let counter = 1;
        const docToUpdate = await this.model.findOne(this.getQuery());
        while (await mongoose.models.City.findOne({ 
            slug: update.slug, 
            _id: { $ne: docToUpdate._id } 
        })) {
            update.slug = `${baseSlug}-${counter}-gezilecek-yerler`;
            counter++;
        }
    }
    next();
});

const City = mongoose.model('City', citySchema);

module.exports = City;
