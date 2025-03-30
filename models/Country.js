const mongoose = require('mongoose');
const slugify = require('slugify');

const countrySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        trim: true
    },
    flagUrl: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    cities: [{ 
        type: String,
        trim: true 
    }],
    slug: { 
        type: String, 
        unique: true, 
        lowercase: true,
        trim: true
    }
}, { 
    timestamps: true 
});

// Slug oluşturma middleware
countrySchema.pre('save', async function(next) {
    // Eğer name değişmediyse veya slug manuel olarak ayarlandıysa işlem yapma
    if (!this.isModified('name') || this.isModified('slug')) {
        return next();
    }

    try {
        const baseSlug = slugify(this.name, {
            lower: true,
            strict: true,
            locale: 'tr'
        });

        // Benzersiz slug oluştur
        let slugToCheck = baseSlug;
        let counter = 1;
        
        while (await mongoose.models.Country.findOne({ 
            slug: slugToCheck, 
            _id: { $ne: this._id } 
        })) {
            slugToCheck = `${baseSlug}-${counter}`;
            counter++;
        }
        
        this.slug = slugToCheck;
        next();
    } catch (error) {
        next(error);
    }
});

// Güncelleme işlemlerinde slug oluşturma
countrySchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();
    
    // Eğer name değişmediyse veya slug manuel olarak ayarlandıysa işlem yapma
    if (!update.name || update.slug) {
        return next();
    }

    try {
        const baseSlug = slugify(update.name, {
            lower: true,
            strict: true,
            locale: 'tr'
        });

        // Benzersiz slug oluştur
        let slugToCheck = baseSlug;
        let counter = 1;
        
        const docToUpdate = await this.model.findOne(this.getQuery());
        while (await mongoose.models.Country.findOne({ 
            slug: slugToCheck, 
            _id: { $ne: docToUpdate._id } 
        })) {
            slugToCheck = `${baseSlug}-${counter}`;
            counter++;
        }
        
        update.slug = slugToCheck;
        next();
    } catch (error) {
        next(error);
    }
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;