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
        const uploadDir = 'public/uploads/temp';
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

    // Admin panel ana sayfasını render et
    static async renderDashboard(req, res) {
        try {
            // İstatistik verileri
            const [userCount, countryCount, cityCount, commentCount] = await Promise.all([
                User.countDocuments(),
                Country.countDocuments(),
                City.countDocuments(),
                Comment.countDocuments()
            ]);

            // Son eklenen kullanıcılar
            const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
            
            // Son yorumlar
            const recentComments = await Comment.find()
                .populate('userId', 'username')
                .sort({ createdAt: -1 })
                .limit(5);

            res.render('admin/dashboard', {
                stats: {
                    userCount,
                    countryCount,
                    cityCount,
                    commentCount
                },
                recentUsers,
                recentComments
            });
        } catch (error) {
            console.error('Dashboard render hatası:', error);
            res.status(500).send('Dashboard yüklenirken bir hata oluştu');
        }
    }

    // Admin girişi
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

    // Kullanıcıları listele
    static async renderUsers(req, res) {
        try {
            const users = await User.find().sort({ createdAt: -1 });
            res.render('admin/users', { users });
        } catch (error) {
            console.error('Kullanıcı listesi hatası:', error);
            res.status(500).send('Kullanıcılar listelenirken bir hata oluştu');
        }
    }

    // Kullanıcıyı sil
    static async deleteUser(req, res) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.redirect('/admin/users');
        } catch (error) {
            console.error('Kullanıcı silme hatası:', error);
            res.status(500).send('Kullanıcı silinirken bir hata oluştu');
        }
    }

    // Yorumları listele
    static async renderComments(req, res) {
        try {
            const comments = await Comment.find()
                .populate('userId', 'username')
                .populate('cityId', 'name')
                .populate('countryId', 'name')
                .sort({ createdAt: -1 });
            res.render('admin/comments', { comments });
        } catch (error) {
            console.error('Yorum listesi hatası:', error);
            res.status(500).send('Yorumlar listelenirken bir hata oluştu');
        }
    }

    // Yorumu sil
    static async deleteComment(req, res) {
        try {
            await Comment.findByIdAndDelete(req.params.id);
            res.redirect('/admin/comments');
        } catch (error) {
            console.error('Yorum silme hatası:', error);
            res.status(500).send('Yorum silinirken bir hata oluştu');
        }
    }

    // Ülkeleri listele
    static async renderCountries(req, res) {
        try {
            const countries = await Country.find().sort({ name: 1 });
            res.render('admin/countries', { countries });
        } catch (error) {
            console.error('Ülke listesi hatası:', error);
            res.status(500).send('Ülkeler listelenirken bir hata oluştu');
        }
    }

    // Ülke ekleme sayfası
    static async renderAddCountry(req, res) {
        res.render('admin/add-country');
    }

    // Ülke düzenleme sayfası
    static async renderEditCountry(req, res) {
        try {
            const country = await Country.findById(req.params.id);
            if (!country) {
                return res.status(404).send('Ülke bulunamadı');
            }
            res.render('admin/edit-country', { country });
        } catch (error) {
            console.error('Ülke düzenleme sayfası hatası:', error);
            res.status(500).send('Ülke düzenleme sayfası yüklenirken bir hata oluştu');
        }
    }

    // Yeni ülke ekle
    static async addCountry(req, res) {
        try {
            const { name, description } = req.body;
            const country = new Country({ 
                name, 
                description,
                imageUrl: req.file ? `/images/${req.file.filename}` : null
            });
            await country.save();
            res.redirect('/admin/countries');
        } catch (error) {
            console.error('Ülke ekleme hatası:', error);
            res.status(500).send('Ülke eklenirken bir hata oluştu');
        }
    }

    // Ülke güncelle
    static async updateCountry(req, res) {
        try {
            const { name, description, slug } = req.body;
            const updateData = { name, description };
            
            if (slug) {
                updateData.slug = slug;
            }
            
            if (req.file) {
                updateData.imageUrl = `/images/${req.file.filename}`;
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

    // Ülke sil
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
            // Bu ülkeye ait şehirleri de sil
            await City.deleteMany({ countryId: req.params.id });
            res.redirect('/admin/countries');
        } catch (error) {
            console.error('Ülke silme hatası:', error);
            res.status(500).send('Ülke silinirken bir hata oluştu');
        }
    }

    // Şehirleri listele
    static async renderCities(req, res) {
        try {
            const cities = await City.find().populate('countryId', 'name').sort({ name: 1 });
            const countries = await Country.find().sort({ name: 1 });
            res.render('admin/cities', { cities, countries });
        } catch (error) {
            console.error('Şehir listesi hatası:', error);
            res.status(500).send('Şehirler listelenirken bir hata oluştu');
        }
    }

    // Şehir düzenleme sayfası
    static async renderEditCity(req, res) {
        try {
            const city = await City.findById(req.params.id);
            if (!city) {
                return res.status(404).send('Şehir bulunamadı');
            }
            const countries = await Country.find().sort({ name: 1 });
            res.render('admin/edit-city', { city, countries });
        } catch (error) {
            console.error('Şehir düzenleme sayfası hatası:', error);
            res.status(500).send('Şehir düzenleme sayfası yüklenirken bir hata oluştu');
        }
    }

    // Yeni şehir ekle
    static async addCity(req, res) {
        try {
            const { name, countryId, description } = req.body;
            const city = new City({ 
                name, 
                countryId, 
                description,
                imageUrl: req.file ? `/images/${req.file.filename}` : null
            });
            await city.save();
            res.redirect('/admin/cities');
        } catch (error) {
            console.error('Şehir ekleme hatası:', error);
            res.status(500).send('Şehir eklenirken bir hata oluştu');
        }
    }

    // Şehir güncelle
    static async updateCity(req, res) {
        try {
            const { name, countryId, description, slug } = req.body;
            const updateData = { name, countryId, description };
            
            if (slug) {
                updateData.slug = slug;
            }
            
            if (req.file) {
                updateData.imageUrl = `/images/${req.file.filename}`;
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

    // Şehir sil
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
            console.error('Şehir silme hatası:', error);
            res.status(500).send('Şehir silinirken bir hata oluştu');
        }
    }
}

module.exports = AdminController;

