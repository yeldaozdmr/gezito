const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const City = require('./models/City');  // City modelini import edin
const User = require('./models/User');



// Route dosyalarını import et
const indexRoutes = require('./routes/pageRouter');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3005;

// MongoDB Atlas URL'i
const MONGODB_URI = 'mongodb+srv://yeldaozd2:1234@cluster0.j1mpx.mongodb.net/travel-guide?retryWrites=true&w=majority';
// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statik dosya servisi
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(express.json());

app.use('/', adminRoutes);

// MongoDB bağlantısı
mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ MongoDB bağlantısı başarılı'))
.catch(err => console.error('❌ MongoDB bağlantı hatası:', err.message));

// MongoDB bağlantı durumunu izle
mongoose.connection.on('connected', () => console.log('🔗 Mongoose bağlantısı kuruldu'));
mongoose.connection.on('error', err => console.error('⚠️ Mongoose bağlantı hatası:', err.message));
mongoose.connection.on('disconnected', () => console.log('🔌 Mongoose bağlantısı kesildi'));

// Session ayarları
app.use(session({
    secret: 'gizli-anahtar',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: MONGODB_URI,
        ttl: 14 * 24 * 60 * 60 // 14 gün
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 14 }
}));

// Kullanıcı bilgilerini ve giriş durumunu ayarlayan middleware
app.use(async (req, res, next) => {
    res.locals.isAuthenticated = req.session.userId != null; // Kullanıcı giriş yaptıysa true
    if (req.session.userId) {
        try {
            res.locals.user = await User.findById(req.session.userId); // Kullanıcı bilgilerini al
        } catch (err) {
            console.error('Kullanıcı bilgileri alınamadı:', err);
            res.locals.user = null; // Hata durumunda kullanıcı bilgilerini null yap
        }
    } else {
        res.locals.user = null; // Kullanıcı yoksa null
    }
    res.locals.user = req.session.userId ? { username: req.session.username } : null; // Kullanıcı bilgilerini yerel değişkenlere ekleyin
    next();
});

// Routes
app.use('/', indexRoutes);


// Şehir Detayları Route'u
app.get('/sehir/:slug', async (req, res) => {
    try {
        const citySlug = req.params.slug;  // URL parametresi ile slug alınır
        const city = await City.findOne({ slug: citySlug }).populate('attractions');  // Şehri slug ile buluyoruz
        if (!city) {
            return res.status(404).send('Şehir bulunamadı');  // Şehir bulunamazsa hata
        }
        res.render('city-detail', { city });  // Şehir detaylarını city-detail şablonuna gönderiyoruz
    } catch (err) {
        res.status(500).send('Bir hata oluştu');  // Hata durumunda 500 döner
    }
});

// API Endpoint: Tüm turistik yerleri getir
app.get("/api/attractions", async (req, res) => {
    try {
        const attractions = await Attraction.find().populate('city');
        res.json(attractions);
    } catch (err) {
        res.status(500).json({ message: "Veri alınamadı", error: err });
    }
});

// Hata yakalama middleware
app.use((err, req, res, next) => {
    console.error('⚠️ Hata:', err.stack);
    res.status(500).send('Bir şeyler ters gitti!');
});

// Sunucu başlat
const server = app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
});

// Graceful shutdown (Sunucu düzgün kapatma)
process.on('SIGINT', async () => {
    console.log('🛑 Sunucu kapatılıyor...');
    await mongoose.connection.close();
    server.close(() => {
        console.log('✅ Bağlantılar kapatıldı, çıkılıyor.');
        process.exit(0);
    });
});

// Giriş işlemi
app.post('/login', async (req, res) => {
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
        req.session.username = user.username;
        req.session.role = user.role; // Kullanıcı rolünü oturuma kaydet

        // Kullanıcı rolünü kontrol et ve yönlendir
        if (user.role === 'admin') {
            return res.redirect('/admin');
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).send('Bir hata oluştu.');
    }
});
