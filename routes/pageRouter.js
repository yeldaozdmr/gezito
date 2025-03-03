const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const actionController = require('../controllers/actionController');

// 🌍 Ana Sayfa
router.get('/', pageController.getHomePage);

// 🇹🇷 Ülke Sayfası
router.get('/ulke/:slug', pageController.getCountryDetails);

// 🏙️ Şehir Detay Sayfası
router.get('/sehir/:slug', pageController.cityDetail);

// ✉️ İletişim Sayfası
router.get('/iletisim', pageController.getContactPage);

// 🌍 Ülke & Şehir Listeleme (Gezinme Sayfası)
router.get('/ulkeler', (req, res) => pageController.getCountriesList(req, res));
router.get('/sehirler', (req, res) => pageController.getCitiesList(req, res));


// 🔑 Giriş/Kayıt Sayfası
router.get('/giris', pageController.getLoginPage);

// Kullanıcı kaydı
router.post('/auth/register', actionController.register);

// Kullanıcı girişi
router.post('/auth/login', actionController.login);

// Çıkış yapma
router.get('/auth/logout', actionController.logout);

// İletişim formu gönderimi
router.post('/contact', actionController.iletisim);

// Yorum gönderimi
router.post('/comments', actionController.addComment);

// Yorumları gösterme
router.get('/somePage', pageController.getComments);

module.exports = router;


