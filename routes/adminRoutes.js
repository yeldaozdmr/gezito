const express = require('express');
const router = express.Router();
const { ensureAdmin } = require('../middlewares/authMiddleware');
const Country = require('../models/Country');
const City = require('../models/City');

// Admin panelini render et
router.get('/admin', ensureAdmin, async (req, res) => {
    const countries = await Country.find();
    res.render('admin', { countries });
});

// Ülke ekleme işlemi
router.post('/admin/add-country', ensureAdmin, async (req, res) => {
    const { name, description } = req.body;
    const country = new Country({ name, description });
    await country.save();
    res.redirect('/admin');
});

// Şehir ekleme işlemi
router.post('/admin/add-city', ensureAdmin, async (req, res) => {
    const { name, countryId, description } = req.body;
    const city = new City({ name, countryId, description });
    await city.save();
    res.redirect('/admin');
});

module.exports = router;
