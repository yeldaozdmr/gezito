const Country = require('../models/Country');
const City = require('../models/City');
const Comment = require('../models/Comment');
const Dish = require('../models/Dish');

// Anasayfa için veri getir
async function getHomePage(req, res) {
    try {
        const [cities, countries] = await Promise.all([
            City.find().sort({ name: 1 }).limit(8),
            Country.find().sort({ name: 1 }).limit(8)
        ]);

        cities.forEach(city => city.imageUrl = `/images/${city.slug}.jpg`);
        countries.forEach(country => country.imageUrl = `/images/${country.slug}.jpg`);

        res.render('index', { cities, countries });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// İletişim sayfasını render et
function getContactPage(req, res) {
    res.render('contact');
}

// Giriş sayfasını render et
function getLoginPage(req, res) {
    res.render('auth');
}

// Ülke detaylarını göster
async function getCountryDetails(req, res) {
    try {
        const country = await Country.findOne({ slug: req.params.slug });
        if (!country) return res.status(404).send('Ülke bulunamadı.');

        country.imageUrl = `/images/${country.slug}.jpg`;
        const comments = await Comment.find({ countryId: country._id }).populate('userId', 'username');

        res.render('ulke', { country, comments });
    } catch (error) {
        res.status(500).send('Bir hata oluştu.');
    }
}

// Şehir detaylarını göster
async function cityDetail(req, res) {
    try {
        const city = await City.findOne({ slug: req.params.slug });
        if (!city) return res.status(404).send('Şehir bulunamadı.');

        city.imageUrl = `/images/${city.slug}.jpg`;
        const comments = await Comment.find({ cityId: city._id }).populate('userId', 'username');

        res.render('city', {
            city,
            comments,
            title: `${city.name} Gezi Rehberi - Gezilecek Yerler - Gezito`,
            description: city.description
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Bir hata oluştu', error: { status: 500 } });
    }
}

// Tüm şehirleri listele (sayfalama ile)
async function getCitiesList(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    try {
        const [cities, totalCities] = await Promise.all([
            City.find().sort({ name: 1 }).skip(skip).limit(limit),
            City.countDocuments()
        ]);
        
        cities.forEach(city => city.imageUrl = `/images/${city.slug}.jpg`);
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
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// Tüm ülkeleri listele
async function getCountriesList(req, res) {
    try {
        const countries = await Country.find().sort({ name: 1 });
        countries.forEach(country => country.imageUrl = `/images/${country.slug}.jpg`);

        res.render('browse', {
            type: 'country',
            title: 'Ülkeler',
            countries
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// Yorumları al ve göster
async function getComments(req, res) {
    try {
        const comments = await Comment.find().populate('userId', 'username');
        res.render('somePage', { comments });
    } catch (err) {
        res.status(500).send('Yorumları getirirken bir hata oluştu: ' + err.message);
    }
}

// Yemekleri listele
async function getDishes(req, res) {
    try {
        const dishes = await Dish.find({ cityId: req.query.citySlug }).sort({ name: 1 });
        res.render('dishes', { dishes });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    cityDetail,
    getComments,
    getContactPage,
    getCountriesList,
    getCountryDetails,
    getCitiesList,
    getDishes,
    getHomePage,
    getLoginPage
};