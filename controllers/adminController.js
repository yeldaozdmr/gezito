const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Country = require('../models/Country');
const City = require('../models/City');
const { ensureAdmin } = require('../middlewares/authMiddleware');

// Basit kullanıcı bilgileri
const adminCredentials = {
    email: 'yeldaozdmrr3434@gmail.com', // Burayı kendi e-posta adresinizle değiştirin
    password: 'yelda2306' // Burayı kendi şifrenizle değiştirin
};

// Giriş sayfasını render et
router.get('/login', (req, res) => {
    res.render('auth'); // auth.ejs dosyasını render et
});

// Giriş işlemi
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send('Kullanıcı bulunamadı.');
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).send('Yanlış şifre.');
        }

        // Kullanıcı oturumunu başlat
        req.session.userId = user._id;
        req.session.role = user.role;

        // Kullanıcı rolünü kontrol et ve yönlendir
        if (user.role === 'admin') {
            return res.redirect('/admin');
        } else {
            return res.redirect('/user');
        }
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).send('Bir hata oluştu.');
    }
});

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

// Örnek: Şehir ekleme işlemi
router.post('/admin/add-city', ensureAdmin, async (req, res) => {
    const { name, countryId, description } = req.body;
    const slug = slugify(name, { lower: true, strict: true }); // Slug oluşturma
    const city = new City({ name, countryId, description, slug });
    await city.save();
    res.redirect('/admin');
});

module.exports = router;
