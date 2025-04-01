const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const User = require('./models/User');  // User modelini import et

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
    saveUninitialized: true,
    store: MongoStore.create({ 
        mongoUrl: MONGODB_URI,
        ttl: 14 * 24 * 60 * 60, // 14 gün
        debug: false,
        autoRemove: 'native'
    }),
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24 * 14,
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Kullanıcı bilgilerini ve giriş durumunu ayarlayan middleware
app.use(async (req, res, next) => {
    res.locals.isAuthenticated = req.session.userId != null;
    if (req.session.userId) {
        try {
            res.locals.user = await User.findById(req.session.userId);
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    res.locals.user = req.session.userId ? { username: req.session.username } : null;
    next();
});

// Routes - Sıralama önemli!
app.use('/admin', adminRoutes);  // Admin routes /admin prefix'i ile
app.use('/', indexRoutes);      // Ana routes en sonda

// Hata yakalama middleware
app.use((err, req, res, next) => {
    console.error('Hata:', err.message);
    res.status(500).send('Bir şeyler ters gitti!');
});

// Sunucu başlat
const server = app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
});

