const express = require('express');
const router = express.Router();
const Country = require('../models/Country');
const City = require('../models/City');
const Attraction = require('../models/Attraction');
const Region = require('../models/Region');
const CountryController = require('../controllers/CountryController');
const CityController = require('../controllers/CityController');

// Ana sayfa
router.get('/', async (req, res) => {
    try {
        const cities = await City.find().sort({ name: 1 }).limit(8);
        const countries = await Country.find().sort({ name: 1 }).limit(8);
        res.render('index', { cities, countries });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Tüm şehirleri getir (Header menüsü için)
router.get('/api/cities', async (req, res) => {
    try {
        const cities = await City.find()
            .select('name')
            .sort({ name: 1 })
            .collation({ locale: 'tr', strength: 2 }); // Türkçe karakter sıralaması için
        res.json(cities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ülke sayfası
router.get('/ulke/:slug', async (req, res) => {
    try {
        const country = await Country.findOne({ 
            slug: req.params.slug
        }).populate({
            path: 'cities',
            select: 'name imageUrl description slug'
        });

        if (!country) {
            return res.status(404).render('error', { 
                message: 'Ülke bulunamadı',
                error: { status: 404 }
            });
        }

        res.render('country', { 
            country,
            title: `${country.name} Gezi Rehberi - Gezito`,
            description: country.description
        });
    } catch (error) {
        console.error('Ülke sayfası hatası:', error);
        res.status(500).render('error', { 
            message: 'Bir hata oluştu',
            error: { status: 500 }
        });
    }
});

// Şehirler sayfası
router.get('/sehirler', async (req, res) => {
    try {
        const cities = await City.find().sort({ name: 1 });
        res.render('cities', { cities });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Şehir detay sayfası
router.get('/sehir/:slug', CityController.city);

// İletişim sayfası
router.get('/iletisim', (req, res) => {
    res.render('contact');
});

// Arama API'si
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

// Gezinme ve arama sayfaları için tek route
router.get('/browse/:type', async (req, res) => {
    const { type } = req.params;
    const sortBy = req.query.sort || 'region';
    
    try {
        if (type === 'country') {
            // Tüm ülkeleri getir
            const countries = await Country.find().sort({ name: 1 });
            
            res.render('browse', { 
                type: 'country', 
                title: 'Ülkeler',
                countries,
                sortBy
            });
        } else if (type === 'city') {
            // Şehirler (alfabetik sıralı ve sayfalı)
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

// Popüler öğeler API'si
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
                // ... diğer kıtalar
            ];
        }
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Giriş/Kayıt sayfası
router.get('/giris', (req, res) => {
    res.render('auth');
});

// Ülke detay sayfası
router.get('/ulke/:id', CountryController.country);

// Meşhur yemekler sayfası
router.get('/sehir/:slug/yemekler', (req, res) => {
    // Burada meşhur yemekler sayfasını render edebilirsiniz
    res.render('famous-foods', { citySlug: req.params.slug });
});

module.exports = router; 