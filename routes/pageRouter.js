const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const actionController = require('../controllers/actionController');
const slugify = require('slugify');         
const { ensureAuth } = require('../middlewares/authMiddleware');


// 🌍 Ana Sayfa
router.get('/', pageController.getIndex);

// 🇹🇷 Ülke Sayfası
router.get('/ulke/:slug', pageController.getCountryPage);

// 🏙️ Şehir Detay Sayfası
router.get('/sehir/:slug', pageController.getCityPage);

// ✉️ İletişim Sayfası
router.get('/iletisim', pageController.getContactPage);

// 🌍 Ülke & Şehir Listeleme (Gezinme Sayfası)
router.get('/ulkeler', pageController.getCountriesPage);
router.get('/sehirler', pageController.getCitiesPage);

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
router.post('/iletisim', actionController.iletisim);

// Yorum gönderimi
router.post('/comments', actionController.addComment);

// Yorumları gösterme
router.get('/somePage', pageController.getComments);

// Yemekleri listele
router.get('/dishes', pageController.getDishes);

// Profil sayfası (giriş yapmış kullanıcılar için)
router.get('/profil', ensureAuth, pageController.getProfilePage);

// Hakkımızda sayfası
router.get('/hakkimizda', pageController.getAboutPage);

// Şifremi unuttum
router.get('/sifremi-unuttum', actionController.getForgotPasswordPage);
router.post('/auth/forgot-password', actionController.forgotPassword);
router.get('/sifremi-sifirla/:token', actionController.getResetPasswordPage);
router.post('/auth/reset-password/:token', actionController.resetPassword);

// Kullanım şartları
router.get('/kullanim-sartlari', (req, res) => {
    res.render('terms');
});

module.exports = router;


