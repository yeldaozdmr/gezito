const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const actionController = require('../controllers/actionController');
const slugify = require('slugify');         
const { ensureAuth } = require('../middlewares/authMiddleware');


// 🌍 Ana Sayfa
router.get('/', pageController.getHomePage);

// 🇹🇷 Ülke Sayfası
router.get('/ulke/:slug', pageController.getCountryDetails);

// 🏙️ Şehir Detay Sayfası
router.get('/sehir/:slug', pageController.cityDetail);

// ✉️ İletişim Sayfası
router.get('/iletisim', pageController.getContactPage);

// 🌍 Ülke & Şehir Listeleme (Gezinme Sayfası)
router.get('/ulkeler', pageController.getCountriesList);
router.get('/sehirler', pageController.getCitiesList);

// 🔑 Giriş/Kayıt Sayfası
router.get('/giris', pageController.getLoginPage);

// Kayıt sayfası
router.get('/kayit', pageController.getRegisterPage);

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

// Yemekleri listele
router.get('/dishes', pageController.getDishes);

// Profil sayfası (giriş yapmış kullanıcılar için)
router.get('/profil', ensureAuth, pageController.getProfilePage);

module.exports = router;


