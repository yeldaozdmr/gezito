const Country = require('../models/Country');

async function getCountryById(req, res) {
    try {
        const countryId = req.params.id;
        const country = await Country.findById(countryId).populate('cities');

        if (!country) {
            return res.status(404).send('Ülke bulunamadı.');
        }

        const relatedCountries = await Country.find({ _id: { $ne: countryId } }).limit(4);

        res.render('country', {
            country,
            relatedCountries
        });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).send('Bir hata oluştu.');
    }
}

async function getCountryBySlug(req, res) {
    try {
        const slug = req.params.slug;
        const country = await Country.findOne({ slug }).populate('cities');

        if (!country) {
            return res.status(404).send('Ülke bulunamadı.');
        }

        res.render('ulke', { country });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).send('Bir hata oluştu.');
    }
}

async function getCountryDetails(req, res) {
    const slug = req.params.slug;
    try {
        const country = await Country.findOne({ slug }).populate('cities');

        if (!country) {
            return res.status(404).send('Ülke bulunamadı.');
        }

        res.render('ulke', { country });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).send('Bir hata oluştu.');
    }
}

module.exports = {
    getCountryById,
    getCountryBySlug,
    getCountryDetails
};
