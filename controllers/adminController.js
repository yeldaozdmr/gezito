const User = require('../models/User');
const Country = require('../models/Country');
const City = require('../models/City');
const Comment = require('../models/Comment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
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

class AdminController {
    static getUpload() {
        return upload;
    }

    // Giriş sayfasını render et
    static async renderLogin(req, res) {
        res.render('auth'); // auth.ejs dosyasını render et
    }

    // Giriş işlemi
    static async handleLogin(req, res) {
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
                return res.redirect('/admin/dashboard');
            } else {
                return res.redirect('/');
            }
        } catch (error) {
            console.error('Giriş hatası:', error);
            res.status(500).send('Bir hata oluştu.');
        }
    }

    // Admin Dashboard
    static async renderDashboard(req, res) {
        try {
            const countries = await Country.find().sort({ name: 1 });
            const cities = await City.find().populate('countryId').sort({ name: 1 });
            const users = await User.find().sort({ createdAt: -1 });
            const comments = await Comment.find().populate('userId', 'username').sort({ createdAt: -1 });

            res.render('admin/dashboard', { 
                page: 'dashboard',
                countries, 
                cities, 
                users: users || [], 
                comments: comments || []
            });
        } catch (error) {
            console.error('Dashboard hatası:', error);
            res.status(500).send('Bir hata oluştu');
        }
    }

    // Users Page
    static async renderUsers(req, res) {
        try {
            const users = await User.find().sort({ createdAt: -1 });
            res.render('admin/users', { 
                page: 'users',
                users: users || []
            });
        } catch (error) {
            console.error('Kullanıcılar sayfası hatası:', error);
            res.status(500).send('Bir hata oluştu');
        }
    }

    // Comments Page
    static async renderComments(req, res) {
        try {
            const comments = await Comment.find().populate('userId', 'username').sort({ createdAt: -1 });
            res.render('admin/comments', { 
                page: 'comments',
                comments: comments || []
            });
        } catch (error) {
            console.error('Yorumlar sayfası hatası:', error);
            res.status(500).send('Bir hata oluştu');
        }
    }

    // Countries Page
    static async renderCountries(req, res) {
        try {
            const countries = await Country.find().sort({ name: 1 });
            res.render('admin/countries', { 
                page: 'countries',
                countries
            });
        } catch (error) {
            console.error('Ülkeler sayfası hatası:', error);
            res.status(500).send('Bir hata oluştu');
        }
    }

    // Cities Page
    static async renderCities(req, res) {
        try {
            const cities = await City.find().populate('countryId').sort({ name: 1 });
            const countries = await Country.find().sort({ name: 1 });
            res.render('admin/cities', { 
                page: 'cities',
                cities,
                countries
            });
        } catch (error) {
            console.error('Şehirler sayfası hatası:', error);
            res.status(500).send('Bir hata oluştu');
        }
    }

    // Countries Section
    static async renderEditCountry(req, res) {
        try {
            const country = await Country.findById(req.params.id);
            res.render('admin/edit-country', { 
                country,
                isAuthenticated: req.session.isAuthenticated,
                isAdmin: req.session.isAdmin 
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Sunucu hatası');
        }
    }

    static async addCountry(req, res) {
        try {
            const { name, description } = req.body;
            const country = new Country({ 
                name, 
                description,
                imageUrl: req.file ? `/uploads/${req.file.filename}` : null
            });
            await country.save();
            res.redirect('/admin/countries');
        } catch (error) {
            console.error('Ülke ekleme hatası:', error);
            res.status(500).send('Ülke eklenirken bir hata oluştu');
        }
    }

    static async updateCountry(req, res) {
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
            res.redirect('/admin/countries');
        } catch (error) {
            console.error('Ülke güncelleme hatası:', error);
            res.status(500).send('Ülke güncellenirken bir hata oluştu');
        }
    }

    static async deleteCountry(req, res) {
        try {
            const country = await Country.findById(req.params.id);
            if (country && country.imageUrl) {
                const imagePath = path.join(__dirname, '../public', country.imageUrl);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            await Country.findByIdAndDelete(req.params.id);
            await City.deleteMany({ countryId: req.params.id });
            res.redirect('/admin/countries');
        } catch (error) {
            res.status(500).send('Ülke silinirken bir hata oluştu');
        }
    }

    // Cities Section
    static async renderEditCity(req, res) {
        try {
            const city = await City.findById(req.params.id).populate('countryId');
            const countries = await Country.find();
            res.render('admin/edit-city', { 
                city,
                countries,
                isAuthenticated: req.session.isAuthenticated,
                isAdmin: req.session.isAdmin 
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Sunucu hatası');
        }
    }

    static async addCity(req, res) {
        try {
            const { name, countryId, description } = req.body;
            const city = new City({ 
                name, 
                countryId, 
                description,
                imageUrl: req.file ? `/uploads/${req.file.filename}` : null
            });
            await city.save();
            res.redirect('/admin/cities');
        } catch (error) {
            console.error('Şehir ekleme hatası:', error);
            res.status(500).send('Şehir eklenirken bir hata oluştu');
        }
    }

    static async updateCity(req, res) {
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
            res.redirect('/admin/cities');
        } catch (error) {
            console.error('Şehir güncelleme hatası:', error);
            res.status(500).send('Şehir güncellenirken bir hata oluştu');
        }
    }

    static async deleteCity(req, res) {
        try {
            const city = await City.findById(req.params.id);
            if (city && city.imageUrl) {
                const imagePath = path.join(__dirname, '../public', city.imageUrl);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            await City.findByIdAndDelete(req.params.id);
            res.redirect('/admin/cities');
        } catch (error) {
            res.status(500).send('Şehir silinirken bir hata oluştu');
        }
    }

    static async deleteUser(req, res) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.redirect('/admin/users');
        } catch (error) {
            res.status(500).send('Kullanıcı silinirken bir hata oluştu');
        }
    }

    static async deleteComment(req, res) {
        try {
            await Comment.findByIdAndDelete(req.params.id);
            res.redirect('/admin/comments');
        } catch (error) {
            res.status(500).send('Yorum silinirken bir hata oluştu');
        }
    }
}

module.exports = AdminController;
