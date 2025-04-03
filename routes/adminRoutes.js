const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { requireAdmin } = require('../middlewares/authMiddleware');
const upload = AdminController.getUpload();
const { compressImage } = require('../config/multer');

// Ana sayfalar
router.get('/dashboard', requireAdmin, AdminController.renderDashboard);
router.get('/users', requireAdmin, AdminController.renderUsers);
router.get('/comments', requireAdmin, AdminController.renderComments);
router.get('/countries', requireAdmin, AdminController.renderCountries);
router.get('/cities', requireAdmin, AdminController.renderCities);

// Dashboard'a yönlendirme
router.get('/', requireAdmin, (req, res) => {
    res.redirect('/admin/dashboard');
});

// Ülke işlemleri
router.post('/countries/add', requireAdmin, upload.single('image'), compressImage, AdminController.addCountry);
router.get('/edit-country/:id', requireAdmin, AdminController.renderEditCountry);
router.post('/update-country/:id', requireAdmin, upload.single('image'), compressImage, AdminController.updateCountry);
router.get('/delete-country/:id', requireAdmin, AdminController.deleteCountry);

// Şehir işlemleri
router.post('/cities/add', requireAdmin, upload.single('image'), compressImage, AdminController.addCity);
router.get('/edit-city/:id', requireAdmin, AdminController.renderEditCity);
router.post('/update-city/:id', requireAdmin, upload.single('image'), compressImage, AdminController.updateCity);
router.get('/delete-city/:id', requireAdmin, AdminController.deleteCity);

// Kullanıcı işlemleri
router.get('/delete-user/:id', requireAdmin, AdminController.deleteUser);

// Yorum işlemleri
router.get('/delete-comment/:id', requireAdmin, AdminController.deleteComment);

module.exports = router;
