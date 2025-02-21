const express = require('express');
const router = express.Router();
const { getCountryById, getCountryBySlug } = require('../controllers/CountryController');

router.get('/country/:id', getCountryById); // ID ile ülke getir
router.get('/country/slug/:slug', getCountryBySlug); // Slug ile ülke getir

module.exports = router;
