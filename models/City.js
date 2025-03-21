const mongoose = require('mongoose');
const slugify = require('slugify');

const citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    description: String,
    slug: { type: String, unique: true, lowercase: true },
    imageUrl: String,
    famousDishes: [{
        name: String,
        imageUrl: String
    }]
}, { timestamps: true });

// Slug oluşturma middleware
citySchema.pre('save', async function(next) {
    if ((this.isModified('name') || this.isModified('countryId')) && !this.isModified('slug')) {
        try {
            let baseSlug = slugify(this.name, {
                lower: true,
                strict: true,
                locale: 'tr'
            });
            this.slug = `${baseSlug}-gezilecek-yerler`;
            
            // Eğer aynı slug varsa, sonuna numara ekle
            let counter = 1;
            while (await mongoose.models.City.findOne({ slug: this.slug, _id: { $ne: this._id } })) {
                this.slug = `${baseSlug}-${counter}-gezilecek-yerler`;
                counter++;
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
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

module.exports = mongoose.model('City', citySchema);
