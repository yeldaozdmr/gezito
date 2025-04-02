const Country = require('../models/Country');
const City = require('../models/City');
const Comment = require('../models/Comment');
const Dish = require('../models/Dish');
const User = require('../models/User');

// Anasayfa için veri getir
async function getHomePage(req, res) {
    try {
        // Ülkeleri A'dan Z'ye sıralı olarak al
        const countries = await Country.find().sort({ name: 1 });  // A-Z sıralaması
        const cities = await City.find().populate('countryId');
        res.render('index', { 
            countries,
            cities,
            user: req.session.userId ? await User.findById(req.session.userId) : null
        });
    } catch (error) {
        console.error('Ana sayfa hatası:', error);
        res.status(500).send('Bir hata oluştu');
    }
}

// İletişim sayfasını render et
function getContactPage(req, res) {
    res.render('contact');
}

// Giriş sayfasını render et
function getLoginPage(req, res) {
    if (req.session.userId) {
        return res.redirect('/');
    }
    res.render('auth', { page: 'login' });
}

// Kayıt sayfası
function getRegisterPage(req, res) {
    if (req.session.userId) {
        return res.redirect('/');
    }
    res.render('auth', { page: 'register' });
}

// Ülke detaylarını göster
async function getCountryDetails(req, res) {
    try {
        const country = await Country.findOne({ slug: req.params.slug });
        if (!country) return res.status(404).send('Ülke bulunamadı.');

        // Ülkeye ait şehirleri getir
        const cities = await City.find({ countryId: country._id }).sort({ name: 1 });
        
        country.imageUrl = `/images/${country.slug}.jpg`;
        const comments = await Comment.find({ countryId: country._id }).populate('userId', 'username');

        res.render('ulke', { 
            country, 
            cities,
            comments,
            user: req.session.userId ? await User.findById(req.session.userId) : null
        });
    } catch (error) {
        res.status(500).send('Bir hata oluştu.');
    }
}

// Şehir detaylarını göster
async function cityDetail(req, res) {
    try {
        const city = await City.findOne({ slug: req.params.slug }).populate('countryId');
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
        // Ülkeleri A-Z sıralayarak al
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

// Ülke detay sayfası
async function getCountryPage(req, res) {
    try {
        const country = await Country.findOne({ slug: req.params.slug });
        if (!country) {
            return res.status(404).send('Ülke bulunamadı');
        }

        const cities = await City.find({ countryId: country._id });
        res.render('country', { 
            country,
            cities,
            user: req.session.userId ? await User.findById(req.session.userId) : null
        });
    } catch (error) {
        console.error('Ülke sayfası hatası:', error);
        res.status(500).send('Bir hata oluştu');
    }
}

// Profil sayfası
async function getProfilePage(req, res) {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/giris');
        }

        res.render('profile', { user });
    } catch (error) {
        console.error('Profil sayfası hatası:', error);
        res.status(500).send('Bir hata oluştu');
    }
}

const pageController = {
    cityDetail,
    getComments,
    getContactPage,
    getCountriesList,
    getCountryDetails,
    getCitiesList,
    getDishes,
    getHomePage,
    getLoginPage,
    getRegisterPage,
    getCountryPage,
    getProfilePage
};

module.exports = pageController;
