const Country = require('../models/Country');

async function country(req, res) {
    try {
        const countryId = req.params.id;
        const country = await Country.findById(countryId).populate('cities');

        // Benzer ülkeleri bul
        const relatedCountries = await Country.find({ _id: { $ne: countryId } }).limit(4);

        res.render('country', {
            country,
            relatedCountries // Bu değişkeni ekliyoruz
        });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).send('Bir hata oluştu');
    }
}

module.exports = {
    country
}; 