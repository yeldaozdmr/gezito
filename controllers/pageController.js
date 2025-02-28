const Country = require('../models/Country');
const City = require('../models/City');
const Comment = require('../models/Comment');


async function getHomePage(req, res){
    try {
        const cities = await City.find().sort({ name: 1 }).limit(8);
        const countries = await Country.find().sort({ name: 1 }).limit(8);
        res.render('index', { cities, countries });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function getContactPage(req, res) {
    res.render('contact');
}

function getLoginPage (req, res) {
    res.render('auth');
}

async function getCountryDetails(req, res) {
    const slug = req.params.slug;
    try {
        const country = await Country.findOne({ slug });
        const comments = await Comment.find({ countryId: country._id }).populate('userId', 'username'); // Ülkeye ait yorumları çek

        if (!country) {
            return res.status(404).send('Ülke bulunamadı.');
        }

        res.render('ulke', { country, comments }); // Yorumları sayfaya gönder
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).send('Bir hata oluştu.');
    }
}

async function cityDetail(req, res) {
    const citySlug = req.params.slug;
    console.log('Şehir slug:', citySlug);
    try {
        const city = await City.findOne({ slug: citySlug });
        if (!city) {
            return res.status(404).send('Şehir bulunamadı');
        }
        const comments = await Comment.find({ cityId: city._id }).populate('userId', 'username');

        res.render('city', {
            city,
            comments,
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

async function getCityDetails(req, res) {
    try {
        const cities = await City.find().sort({ name: 1 });
        res.render('cities', { cities });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function getCountries (req, res){
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
}

// Yorumları gösterme
async function getComments(req, res) {
    try {
        const comments = await Comment.find().populate('userId', 'username'); // Kullanıcı adını da çek
        res.render('somePage', { comments }); // Yorumları sayfaya gönder
    } catch (err) {
        console.error(err);
        res.status(500).send('Yorumları getirirken bir hata oluştu: ' + err.message);
    }
}

module.exports = {
    getCountryDetails,
    cityDetail,
    getCityDetails,
    getHomePage,
    getContactPage,
    getCountries,
    getLoginPage,
    getComments
};
