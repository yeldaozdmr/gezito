const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ensureAdmin } = require('../middlewares/authMiddleware');
const Country = require('../models/Country');
const City = require('../models/City');

// Multer konfigürasyonu
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Dosya adını slug formatına çevir
        const nameWithoutExt = path.parse(file.originalname).name;
        const ext = path.parse(file.originalname).ext;
        cb(null, `${nameWithoutExt}-gezilecek-yerler${ext}`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Hata: Sadece resim dosyaları yüklenebilir!');
        }
    }
});

// Admin panelini render et
router.get('/admin', ensureAdmin, async (req, res) => {
    try {
        const countries = await Country.find().sort({ name: 1 });
        const cities = await City.find().populate('countryId').sort({ name: 1 });
        res.render('admin', { countries, cities });
    } catch (error) {
        console.error('Admin panel hatası:', error);
        res.status(500).send('Bir hata oluştu');
    }
});

// Ülke ekleme işlemi
router.post('/admin/add-country', ensureAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const country = new Country({ 
            name, 
            description,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null
        });
        await country.save();
        res.redirect('/admin#countryList');
    } catch (error) {
        console.error('Ülke ekleme hatası:', error);
        res.status(500).send('Ülke eklenirken bir hata oluştu');
    }
});

// Şehir ekleme işlemi
router.post('/admin/add-city', ensureAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, countryId, description } = req.body;
        const city = new City({ 
            name, 
            countryId, 
            description,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null
        });
        await city.save();
        res.redirect('/admin#cityList');
    } catch (error) {
        console.error('Şehir ekleme hatası:', error);
        res.status(500).send('Şehir eklenirken bir hata oluştu');
    }
});

// Ülke düzenleme sayfasını render et
router.get('/admin/edit-country/:id', ensureAdmin, async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
        res.render('edit-country', { country });
    } catch (error) {
        res.status(500).send('Ülke bulunamadı');
    }
});

// Ülke güncelleme işlemi
router.post('/admin/edit-country/:id', ensureAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, description, slug } = req.body;
        const updateData = { name, description };
        
        if (slug) {
            updateData.slug = slug;
        }
        
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
            const country = await Country.findById(req.params.id);
            if (country && country.imageUrl) {
                const oldImagePath = path.join(__dirname, '../public', country.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }
        
        await Country.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/admin#countryList');
    } catch (error) {
        console.error('Ülke güncelleme hatası:', error);
        res.status(500).send('Ülke güncellenirken bir hata oluştu');
    }
});

// Ülke silme işlemi
router.get('/admin/delete-country/:id', ensureAdmin, async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
        if (country && country.imageUrl) {
            const imagePath = path.join(__dirname, '../public', country.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        await Country.findByIdAndDelete(req.params.id);
        // İlgili şehirleri de sil
        await City.deleteMany({ countryId: req.params.id });
        res.redirect('/admin#countryList');
    } catch (error) {
        res.status(500).send('Ülke silinirken bir hata oluştu');
    }
});

// Şehir düzenleme sayfasını render et
router.get('/admin/edit-city/:id', ensureAdmin, async (req, res) => {
    try {
        const city = await City.findById(req.params.id).populate('countryId');
        const countries = await Country.find().sort({ name: 1 });
        if (!city) {
            return res.status(404).send('Şehir bulunamadı');
        }
        res.render('edit-city', { city, countries });
    } catch (error) {
        console.error('Şehir düzenleme hatası:', error);
        res.status(500).send('Şehir düzenlenirken bir hata oluştu');
    }
});

// Şehir güncelleme işlemi
router.post('/admin/edit-city/:id', ensureAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, countryId, description, slug } = req.body;
        const updateData = { name, countryId, description };
        
        if (slug) {
            updateData.slug = slug;
        }
        
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
            const city = await City.findById(req.params.id);
            if (city && city.imageUrl) {
                const oldImagePath = path.join(__dirname, '../public', city.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }
        
        await City.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/admin#cityList');
    } catch (error) {
        console.error('Şehir güncelleme hatası:', error);
        res.status(500).send('Şehir güncellenirken bir hata oluştu');
    }
});

// Şehir silme işlemi
router.get('/admin/delete-city/:id', ensureAdmin, async (req, res) => {
    try {
        const city = await City.findById(req.params.id);
        if (city && city.imageUrl) {
            const imagePath = path.join(__dirname, '../public', city.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        await City.findByIdAndDelete(req.params.id);
        res.redirect('/admin#cityList');
    } catch (error) {
        res.status(500).send('Şehir silinirken bir hata oluştu');
    }
});

module.exports = router;
