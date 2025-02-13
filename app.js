const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

// Route dosyalarını import et
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

const app = express();

// MongoDB Atlas URL'i
const MONGODB_URI = 'mongodb+srv://yeldaozd2:1234@cluster0.j1mpx.mongodb.net/travel-guide?retryWrites=true&w=majority';

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB bağlantısı
mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    tls: true,
    tlsInsecure: true
})
.then(() => {
    console.log('MongoDB\'ye başarıyla bağlandı');
})
.catch(err => {
    console.error('MongoDB bağlantı hatası:', err.message);
});

// MongoDB bağlantı durumunu izle
mongoose.connection.on('connected', () => {
    console.log('Mongoose bağlantısı kuruldu');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose bağlantı hatası:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose bağlantısı kesildi');
});

// Session ayarları
app.use(session({
    secret: 'gizli-anahtar',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: MONGODB_URI,
        ttl: 14 * 24 * 60 * 60, // 14 gün
        autoRemove: 'native'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 14 // 14 gün
    }
}));

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Bir şeyler ters gitti!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
}); 