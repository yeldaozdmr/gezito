const express = require('express');
const router = express.Router();
const Country = require('../models/Country');
const City = require('../models/City');
const Region = require('../models/Region');
const Attraction = require('../models/Attraction');
const CountryController = require('../controllers/CountryController');
const CityController = require('../controllers/CityController');

// 🌍 Ana Sayfa
router.get('/', async (req, res) => {
    try {
        const cities = await City.find().sort({ name: 1 }).limit(8);
        const countries = await Country.find().sort({ name: 1 }).limit(8);
        res.render('index', { cities, countries });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 🌆 Şehirleri Getir (Header Menüsü İçin)
router.get('/api/cities', async (req, res) => {
    try {
        const cities = await City.find()
            .select('name')
            .sort({ name: 1 })
            .collation({ locale: 'tr', strength: 2 }); // Türkçe karakter sıralama desteği
        res.json(cities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🇹🇷 Ülke Sayfası
router.get('/ulke/:slug', CountryController.getCountryDetails);

// 🏙️ Şehirler Sayfası
router.get('/sehirler', async (req, res) => {
    try {
        const cities = await City.find().sort({ name: 1 });
        res.render('cities', { cities });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 🏙️ Şehir Detay Sayfası
router.get('/sehir/:slug', CityController.city);

// ✉️ İletişim Sayfası
router.get('/iletisim', (req, res) => {
    res.render('contact');
});

// 🔍 Arama API'si
router.get('/api/search', async (req, res) => {
    const { q } = req.query;
    if (!q || q.length < 2) {
        return res.json([]);
    }
    try {
        const cities = await City.find({
            name: { $regex: q, $options: 'i' }
        })
        .select('name description imageUrl')
        .limit(5);
        res.json(cities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🌍 Ülke & Şehir Listeleme (Gezinme Sayfası)
router.get('/browse/:type', async (req, res) => {
    const { type } = req.params;
    const sortBy = req.query.sort || 'region';
    
    try {
        if (type === 'country') {
            const countries = await Country.find().sort({ name: 1 });
            res.render('browse', { 
                type: 'country', 
                title: 'Ülkeler',
                countries,
                sortBy
            });
        } else if (type === 'city') {
            const page = parseInt(req.query.page) || 1;
            const limit = 12; // Her sayfada 12 şehir
            const skip = (page - 1) * limit;

            const cities = await City.find()
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit);

            const totalCities = await City.countDocuments();
            const totalPages = Math.ceil(totalCities / limit);

            res.render('browse', { 
                type: 'city', 
                title: 'Şehirler',
                cities,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            });
        } else {
            res.status(404).send('Sayfa bulunamadı');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// ⭐ Popüler Öğeler API'si
router.get('/api/popular', async (req, res) => {
    const { type } = req.query;
    try {
        let results = [];
        if (type === 'city') {
            results = await City.find().limit(6);
        } else if (type === 'country') {
            results = await Country.find().limit(6);
        } else if (type === 'continent') {
            results = [
                { name: 'Avrupa', description: 'Tarihi ve kültürel zenginlikler' },
                { name: 'Asya', description: 'Egzotik deneyimler' },
                { name: 'Afrika', description: 'Doğal yaşam ve macera' },
            ];
        }
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔑 Giriş/Kayıt Sayfası
router.get('/giris', (req, res) => {
    res.render('auth');
});

// 🍽️ Meşhur Yemekler Sayfası
router.get('/sehir/:slug/yemekler', async (req, res) => {
    try {
        const city = await City.findOne({ slug: req.params.slug }).select('name famousFoods');
        if (!city) {
            return res.status(404).render('error', { message: 'Şehir bulunamadı' });
        }
        res.render('famous-foods', { citySlug: city.name, city });
    } catch (error) {
        res.status(500).render('error', { message: 'Bir hata oluştu' });
    }
});

// Meşhur Yemekler sayfası
router.get('/meshur-yemekler', (req, res) => {
    res.render('famous-foods'); // famous-foods.ejs dosyasını render et
});

module.exports = router;
