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

const app = express();
const PORT = process.env.PORT || 3004;

// MongoDB Atlas URL'i
const MONGODB_URI = 'mongodb+srv://yeldaozd2:1234@cluster0.j1mpx.mongodb.net/travel-guide?retryWrites=true&w=majority';
// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

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
