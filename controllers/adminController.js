const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Country = require('../models/Country');
const City = require('../models/City');
<<<<<<< HEAD
const { ensureAdmin } = require('../middlewares/authMiddleware');

// Basit kullanıcı bilgileri
const adminCredentials = {
    email: 'yeldaozdmrr3434@gmail.com', // Burayı kendi e-posta adresinizle değiştirin
=======

// Basit kullanıcı bilgileri
const adminCredentials = {
    email: 'admin@example.com', // Burayı kendi e-posta adresinizle değiştirin
>>>>>>> 76da1f5b4c100e2b49652cf707da52a9da980136
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
<<<<<<< HEAD
router.post('/admin/add-country', ensureAdmin, async (req, res) => {
=======
router.post('/admin/add-country', async (req, res) => {
>>>>>>> 76da1f5b4c100e2b49652cf707da52a9da980136
    const { name, description } = req.body;
    const country = new Country({ name, description });
    await country.save();
    res.redirect('/admin');
});

// Şehir ekleme işlemi
<<<<<<< HEAD
router.post('/admin/add-city', ensureAdmin, async (req, res) => {
=======
router.post('/admin/add-city', async (req, res) => {
>>>>>>> 76da1f5b4c100e2b49652cf707da52a9da980136
    const { name, countryId, description } = req.body;
    const city = new City({ name, countryId, description });
    await city.save();
    res.redirect('/admin');
});

<<<<<<< HEAD
=======
// Admin yetkilendirme middleware
function ensureAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Bu sayfaya erişim izniniz yok.');
}

>>>>>>> 76da1f5b4c100e2b49652cf707da52a9da980136
// Örnek: Şehir ekleme işlemi
router.post('/admin/add-city', ensureAdmin, async (req, res) => {
    const { name, countryId, description } = req.body;
    const slug = slugify(name, { lower: true, strict: true }); // Slug oluşturma
    const city = new City({ name, countryId, description, slug });
    await city.save();
    res.redirect('/admin');
});

<<<<<<< HEAD
module.exports = router;
=======
module.exports = { ensureAdmin };
>>>>>>> 76da1f5b4c100e2b49652cf707da52a9da980136
