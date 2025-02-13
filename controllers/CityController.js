const City = require('../models/City');
const Attraction = require('../models/Attraction');

// Tüm şehirleri listele (İlişkili turistik yerler ile birlikte)
exports.getCities = async (req, res) => {
    try {
        const cities = await City.find().populate('attractions');
        res.status(200).json(cities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Belirli bir şehri getir (Slug ile)
exports.getCityBySlug = async (req, res) => {
    try {
        const city = await City.findOne({ slug: req.params.slug }).populate('attractions');
        if (!city) {
            return res.status(404).json({ message: 'Şehir bulunamadı' });
        }
        res.status(200).json(city);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Yeni şehir ekle
exports.createCity = async (req, res) => {
    try {
        const city = new City(req.body);
        await city.save();
        res.status(201).json(city);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Şehri güncelle
exports.updateCity = async (req, res) => {
    try {
        const city = await City.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
        if (!city) {
            return res.status(404).json({ message: 'Şehir bulunamadı' });
        }
        res.status(200).json(city);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Şehri sil
exports.deleteCity = async (req, res) => {
    try {
        const city = await City.findOneAndDelete({ slug: req.params.slug });
        if (!city) {
            return res.status(404).json({ message: 'Şehir bulunamadı' });
        }
        res.status(200).json({ message: 'Şehir silindi' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function city(req, res) {
    try {
        const citySlug = req.params.slug; // Slug'ı al
        const city = await City.findOne({ slug: citySlug }).populate('attractions'); // attractions'ı populate et

        if (!city) {
            return res.status(404).render('error', {
                message: 'Şehir bulunamadı',
                error: { status: 404 }
            });
        }

        res.render('city', {
            city,
            title: `${city.name} Gezi Rehberi - Gezilecek Yerler - Gezito`,
            description: city.description
        });
    } catch (error) {
        console.error('Şehir sayfası hatası:', error);
        res.status(500).render('error', {
            message: 'Bir hata oluştu',
            error: { status: 500 }
        });
    }
}

module.exports = {
    city
};
