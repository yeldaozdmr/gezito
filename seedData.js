const mongoose = require('mongoose');
const City = require('./models/City');
const Country = require('./models/Country');
const express = require('express');

const cities = [
    { name: 'Kapadokya', slug: 'kapadokya', description: 'Kapadokya, Türkiye\'nin en güzel turistik bölgelerinden biridir.', imageUrl: '/images/kapadokya.jpeg' },
    { name: 'Antalya', slug: 'antalya', description: 'Antalya, Türkiye\'nin güney sahilinde yer alan bir tatil cennetidir.', imageUrl: '/images/antalya.jpeg' },
    { name: 'İzmir', slug: 'izmir', description: 'İzmir, Ege Bölgesi\'nin incisi olarak bilinir.', imageUrl: '/images/izmir.jpeg' },
    { name: 'Trabzon', slug: 'trabzon', description: 'Trabzon, Karadeniz Bölgesi\'nin önemli şehirlerinden biridir.', imageUrl: '/images/trabzon.jpeg' },
    { name: 'İstanbul', slug: 'istanbul', description: 'İstanbul, Anadolu ve Avrupa yakasını birleştiren şehirdir.', imageUrl: '/images/istanbul.jpeg' },
    { name: 'Paris', slug: 'paris', description: 'Paris, Fransa\'nın başkenti ve en büyük şehridir.' , imageUrl: '/images/paris.jpeg' },
    { name: 'Nice', slug: 'nice', description: 'Nice, Fransa\'nın güney sahilinde yer alan bir tatil beldesidir.', imageUrl: '/images/nice.jpeg' },
    { name: 'Lyon', slug: 'lyon', description: 'Lyon, Fransa\'nın gastronomi başkenti olarak bilinir.', imageUrl: '/images/lyon.jpeg' },
    { name: 'Bordeaux', slug: 'bordeaux', description: 'Bordeaux, Fransa\'nın ünlü şarap bölgesidir.' , imageUrl: '/images/bordeaux.jpeg' },
    { name: 'Strasbourg', slug: 'strasbourg', description: 'Strasbourg, Avrupa Parlamentosu\'na ev sahipliği yapar.', imageUrl: '/images/strasbourg.jpeg' },
    { name: 'Roma', slug: 'roma', description: 'Roma, İtalya\'nın başkenti ve tarihi bir şehirdir.' , imageUrl: '/images/roma.jpeg' },
    { name: 'Venedik', slug: 'venedik', description: 'Venedik, kanalları ve gondollarıyla ünlü bir İtalyan şehridir.' , imageUrl: '/images/venedik.jpeg' },
    { name: 'Floransa', slug: 'floransa', description: 'Floransa, Rönesans\'ın doğduğu yer olarak bilinir.' , imageUrl: '/images/floransa.jpeg' },
    { name: 'Milano', slug: 'milano', description: 'Milano, İtalya\'nın moda ve tasarım başkentidir.', imageUrl: '/images/milano.jpeg' },
    { name: 'Napoli', slug: 'napoli', description: 'Napoli, İtalya\'nın güneyinde yer alan tarihi bir şehirdir.' , imageUrl: '/images/napoli.jpeg' },
    { name: 'New York', slug: 'new-york', description: 'New York, ABD\'nin en kalabalık şehridir.' , imageUrl: '/images/new_york.jpeg' },
    { name: 'Los Angeles', slug: 'los-angeles', description: 'Los Angeles, Hollywood\'un evi olarak bilinir.' , imageUrl: '/images/los_angeles.jpeg' },
    { name: 'San Francisco', slug: 'san-francisco', description: 'San Francisco, Golden Gate Köprüsü ile ünlüdür.' , imageUrl: '/images/san_francisco.jpeg' },
    { name: 'Las Vegas', slug: 'las-vegas', description: 'Las Vegas, kumarhaneleri ve gece hayatıyla ünlüdür.' , imageUrl: '/images/las_vegas.jpeg' },
    { name: 'Miami', slug: 'miami', description: 'Miami, plajları ve tropikal iklimi ile bilinir.' , imageUrl: '/images/miami.jpeg' },
    { name: 'Tokyo', slug: 'tokyo', description: 'Tokyo, Japonya\'nın başkenti ve en büyük şehridir.' , imageUrl: '/images/tokyo.jpeg' },
    { name: 'Kyoto', slug: 'kyoto', description: 'Kyoto, Japonya\'nın geleneksel kültür merkezi olarak bilinir.', imageUrl: '/images/kyoto.jpeg' },
    { name: 'Osaka', slug: 'osaka', description: 'Osaka, Japonya\'nın önemli ticaret merkezlerinden biridir.' , imageUrl: '/images/osaka.jpeg' },
    { name: 'Hiroşima', slug: 'hirosima', description: 'Hiroşima, II. Dünya Savaşı\'nda atom bombası atılan şehirlerden biridir.' , imageUrl: '/images/hiroşima.jpeg' },
    { name: 'Sapporo', slug: 'sapporo', description: 'Sapporo, Japonya\'nın kuzeyinde yer alan bir şehirdir.', imageUrl: '/images/sapporo.jpeg' },
];

const countries = [
    { name: 'Türkiye', slug: 'turkiye', description: 'Türkiye, Asya ve Avrupa kıtalarını birleştiren bir ülkedir.', imageUrl: '/images/turkiye.jpg', cities: ['Kapadokya', 'Antalya', 'İzmir', 'Trabzon', 'İstanbul'] },
    { name: 'Fransa', slug: 'fransa', description: 'Fransa, Avrupa\'nın batısında yer alan bir ülkedir.', imageUrl: '/images/fransa.jpeg', cities: ['Paris', 'Nice', 'Lyon', 'Bordeaux', 'Strasbourg'] },
    { name: 'Japonya', slug: 'japonya', description: 'Japonya, Doğu Asya\'da bir ada ülkesidir.', imageUrl: '/images/japonya.jpeg', cities: ['Tokyo', 'Kyoto', 'Osaka', 'Hiroşima', 'Sapporo'] },
    { name: 'İtalya', slug: 'italya', description: 'İtalya, Akdeniz\'de bir yarımada ülkesidir.', imageUrl: '/images/italya.jpeg', cities: ['Roma', 'Venedik', 'Floransa', 'Milano', 'Napoli'] },
    { name: 'ABD', slug: 'abd', description: 'ABD, Kuzey Amerika\'da bir ülkedir.', imageUrl: '/images/abd.jpeg', cities: ['New York', 'Los Angeles', 'San Francisco', 'Las Vegas', 'Miami'] }
];

async function seedDatabase() {
    try {
        await mongoose.connect('mongodb+srv://yeldaozd2:1234@cluster0.j1mpx.mongodb.net/travel-guide?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await City.deleteMany({});
        await City.insertMany(cities);

        await Country.deleteMany({});
        await Country.insertMany(countries);

        console.log('Şehirler ve ülkeler başarıyla eklendi!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Veritabanı doldurulurken hata oluştu:', error);
    }
}

seedDatabase();

const app = express();

// Statik dosyalar için 'public' dizinini ayarlayın
app.use(express.static('public'));

// Diğer ayarlar ve rotalar...
