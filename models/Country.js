const mongoose = require('mongoose');
const slugify = require('slugify');

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    content: String,
    flagUrl: String,
    imageUrl: String,
    description: String,
    cities: [{ type: String }] // Şehir isimlerini tutacak
}, { timestamps: true });

// Slug oluşturma middleware
countrySchema.pre('save', async function(next) {
    if (this.isModified('name') && !this.isModified('slug')) {
        let baseSlug = slugify(this.name, {
            lower: true,
            strict: true,
            locale: 'tr'
        });
        this.slug = `${baseSlug}-gezilecek-yerler`;
        
        // Eğer aynı slug varsa, sonuna numara ekle
        let counter = 1;
        while (await mongoose.models.Country.findOne({ slug: this.slug, _id: { $ne: this._id } })) {
            this.slug = `${baseSlug}-${counter}-gezilecek-yerler`;
            counter++;
        }
    }
    next();
});

// Güncelleme işlemlerinde de slug'ı otomatik oluştur
countrySchema.pre('findOneAndUpdate', async function(next) {
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
        while (await mongoose.models.Country.findOne({ 
            slug: update.slug, 
            _id: { $ne: docToUpdate._id } 
        })) {
            update.slug = `${baseSlug}-${counter}-gezilecek-yerler`;
            counter++;
        }
    }
    next();
});

module.exports = mongoose.model('Country', countrySchema);