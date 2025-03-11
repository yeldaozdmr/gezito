const mongoose = require('mongoose');
const City = require('./models/City');
const Country = require('./models/Country');
const express = require('express');

const cities = [
    {
        name: 'Kapadokya',
        slug: 'kapadokya',
        description: 'Kapadokya, Türkiye\'nin en güzel turistik bölgelerinden biridir.',
        imageUrl: '/images/kapadokya.jpg',
        countrySlug: 'turkiye',
        famousDishes: [
            { name: 'Testi Kebabı', imageUrl: '/images/testi-kebabi.jpg' },
            { name: 'Mantı', imageUrl: '/images/manti.jpg' },
            { name: 'Çömlek Fasulye', imageUrl: '/images/comlek-fasulye.jpg' }
        ]
    },
    {
        name: "Antalya",
        slug: "antalya",
        description: "Antalya, Türkiye'nin güney sahilinde yer alan bir tatil cennetidir.",
        imageUrl: "/images/antalya.jpg",
        countrySlug: "turkiye",
        famousDishes: [
          { name: "Piyaz", imageUrl: "/images/piyaz.jpg" },
          { name: "Serpme Börek", imageUrl: "/images/serpme-borek.jpg" },
          { name: "Hibeş", imageUrl: "/images/hibes.jpg" }
        ]
      },
      {
        name: "İzmir",
        slug: "izmir",
        description: "İzmir, Ege Bölgesi'nin incisi olarak bilinir.",
        imageUrl: "/images/izmir.jpg",
        countrySlug: "turkiye",
        famousDishes: [
          { name: "Boyoz", imageUrl: "/images/boyoz.jpg" },
          { name: "Kumru", imageUrl: "/images/kumru.jpg" },
          { name: "Lokma", imageUrl: "/images/lokma.jpg" }
        ]
      },
      {
        name: 'Trabzon',
        slug: 'trabzon',
        description: 'Trabzon, Karadeniz Bölgesi\'nin önemli şehirlerinden biridir.',
        imageUrl: '/images/trabzon.jpg',
        countrySlug: 'turkiye',
        famousDishes: [
          { name: 'Hamsili Pilav', imageUrl: '/images/hamsili-pilav.jpg' },
          { name: 'Kuymak', imageUrl: '/images/kuymak.jpg' },
          { name: 'Trabzon Pidesi', imageUrl: '/images/trabzon-pidesi.jpg' }
        ]
      },
      {
        name: 'İstanbul',
        slug: 'istanbul',
        description: 'İstanbul, Anadolu ve Avrupa yakasını birleştiren şehirdir.',
        imageUrl: '/images/istanbul.jpg',
        countrySlug: 'turkiye',
        famousDishes: [
          { name: 'İskender Kebap', imageUrl: '/images/iskender.jpg' },
          { name: 'Balık Ekmek', imageUrl: '/images/balik-ekmek.jpg' },
          { name: 'Simit', imageUrl: '/images/simit.jpg' }
        ]
      },
      {
        name: 'Paris',
        slug: 'paris',
        description: 'Paris, Fransa\'nın başkenti ve en büyük şehridir.',
        imageUrl: '/images/paris.jpg',
        countrySlug: 'fransa',
        famousDishes: [
          { name: 'Croissant', imageUrl: '/images/croissant.jpg' },
          { name: 'Ratatouille', imageUrl: '/images/ratatouille.jpg' },
          { name: 'Coq au Vin', imageUrl: '/images/coq-au-vin.jpg' }
        ]
      },
      {
        name: 'Tokyo',
        slug: 'tokyo',
        description: 'Tokyo, Japonya\'nın başkenti ve en kalabalık şehridir.',
        imageUrl: '/images/tokyo.jpg',
        countrySlug: 'japonya',
        famousDishes: [
          { name: 'Sushi', imageUrl: '/images/sushi.jpg' },
          { name: 'Ramen', imageUrl: '/images/ramen.jpg' },
          { name: 'Tempura', imageUrl: '/images/tempura.jpg' }
        ]
      },
      {
        name: 'Nice',
        slug: 'nice',
        description: 'Nice, Fransa\'nın güney sahilinde yer alan bir tatil beldesidir.',
        imageUrl: '/images/nice.jpg',
        countrySlug: 'fransa',
        famousDishes: [
          { name: 'Salade Niçoise', imageUrl: '/images/salade-nicoise.jpg' },
          { name: 'Ratatouille', imageUrl: '/images/ratatouille.jpg' },
          { name: 'Socca', imageUrl: '/images/socca.jpg' }
        ]
      },
      {
        name: 'Lyon',
        slug: 'lyon',
        description: 'Lyon, Fransa\'nın gastronomi başkenti olarak bilinir.',
        imageUrl: '/images/lyon.jpg',
        countrySlug: 'fransa',
        famousDishes: [
          { name: 'Coq au Vin', imageUrl: '/images/coq-au-vin.jpg' },
          { name: 'Quenelle', imageUrl: '/images/quenelle.jpg' },
          { name: 'Rosette de Lyon', imageUrl: '/images/rosette-de-lyon.jpg' }
        ]
      },
      {
        name: 'Bordeaux',
        slug: 'bordeaux',
        description: 'Bordeaux, Fransa\'nın ünlü şarap bölgesidir.',
        imageUrl: '/images/bordeaux.jpg',
        countrySlug: 'fransa',
        famousDishes: [
          { name: 'Entrecôte à la Bordelaise', imageUrl: '/images/entrecote-bordelaise.jpg' },
          { name: 'Canelé', imageUrl: '/images/canele.jpg' },
          { name: 'Huîtres du Bassin d\'Arcachon', imageUrl: '/images/huitres-arcachon.jpg' }
        ]
      },
      {
        name: 'Strasbourg',
        slug: 'strasbourg',
        description: 'Strasbourg, Avrupa Parlamentosu\'na ev sahipliği yapar.',
        imageUrl: '/images/strasbourg.jpg',
        countrySlug: 'fransa',
        famousDishes: [
          { name: 'Choucroute', imageUrl: '/images/choucroute.jpg' },
          { name: 'Tarte Flambée', imageUrl: '/images/tarte-flambee.jpg' },
          { name: 'Baeckeoffe', imageUrl: '/images/baeckeoffe.jpg' }
        ]
      },
      {
        name: 'Roma',
        slug: 'roma',
        description: 'Roma, İtalya\'nın başkenti ve tarihî mirasıyla ünlüdür.',
        imageUrl: '/images/roma.jpg',
        countrySlug: 'italya',
        famousDishes: [
          { name: 'Carbonara', imageUrl: '/images/carbonara.jpg' },
          { name: 'Cacio e Pepe', imageUrl: '/images/cacio-e-pepe.jpg' },
          { name: 'Supplì', imageUrl: '/images/suppli.jpg' }
        ]
      },
      {
        name: 'Venedik',
        slug: 'venedik',
        description: 'Venedik, kanalları ve tarihi yapılarıyla ünlüdür.',
        imageUrl: '/images/venedik.jpg',
        countrySlug: 'italya',
        famousDishes: [
          { name: 'Sarde in Saor', imageUrl: '/images/sarde-in-saor.jpg' },
          { name: 'Bigoli in Salsa', imageUrl: '/images/bigoli-in-salsa.jpg' },
          { name: 'Fegato alla Veneziana', imageUrl: '/images/fegato-veneziana.jpg' }
        ]
      },
      {
        name: 'Floransa',
        slug: 'floransa',
        description: 'Floransa, Rönesans’ın doğduğu şehir olarak bilinir.',
        imageUrl: '/images/floransa.jpg',
        countrySlug: 'italya',
        famousDishes: [
          { name: 'Bistecca alla Fiorentina', imageUrl: '/images/bistecca-fiorentina.jpg' },
          { name: 'Ribollita', imageUrl: '/images/ribollita.jpg' },
          { name: 'Pappardelle al Cinghiale', imageUrl: '/images/pappardelle-cinghiale.jpg' }
        ]
      },
      {
        name: 'Milano',
        slug: 'milano',
        description: 'Milano, modanın ve finansın merkezlerinden biridir.',
        imageUrl: '/images/milano.jpg',
        countrySlug: 'italya',
        famousDishes: [
          { name: 'Risotto alla Milanese', imageUrl: '/images/risotto-milanese.jpg' },
          { name: 'Ossobuco', imageUrl: '/images/ossobuco.jpg' },
          { name: 'Cotoletta alla Milanese', imageUrl: '/images/cotoletta-milanese.jpg' }
        ]
      },
      {
        name: 'Napoli',
        slug: 'napoli',
        description: 'Napoli, pizzanın doğduğu şehir olarak bilinir.',
        imageUrl: '/images/napoli.jpg',
        countrySlug: 'italya',
        famousDishes: [
          { name: 'Pizza Napoletana', imageUrl: '/images/pizza-napoletana.jpg' },
          { name: 'Sfogliatella', imageUrl: '/images/sfogliatella.jpg' },
          { name: 'Pasta alla Genovese', imageUrl: '/images/pasta-genovese.jpg' }
        ]
      },
      {
        name: 'New York',
        slug: 'new-york',
        description: 'New York, dünyanın en büyük metropollerinden biridir.',
        imageUrl: '/images/new-york.jpg',
        countrySlug: 'abd',
        famousDishes: [
          { name: 'New York Pizza', imageUrl: '/images/new-york-pizza.jpg' },
          { name: 'Bagel', imageUrl: '/images/bagel.jpg' },
          { name: 'Cheesecake', imageUrl: '/images/cheesecake.jpg' }
        ]
      },
      {
        name: 'Los Angeles',
        slug: 'los-angeles',
        description: 'Los Angeles, Hollywood’un ve eğlence sektörünün merkezidir.',
        imageUrl: '/images/los-angeles.jpg',
        countrySlug: 'abd',
        famousDishes: [
          { name: 'French Dip Sandwich', imageUrl: '/images/french-dip.jpg' },
          { name: 'In-N-Out Burger', imageUrl: '/images/in-n-out.jpg' },
          { name: 'Kore Tacoları', imageUrl: '/images/korean-tacos.jpg' }
        ]
      },
      {
        name: 'San Francisco',
        slug: 'san-francisco',
        description: 'San Francisco, Golden Gate Köprüsü ve teknoloji merkeziyle ünlüdür.',
        imageUrl: '/images/san-francisco.jpg',
        countrySlug: 'abd',
        famousDishes: [
          { name: 'Clam Chowder', imageUrl: '/images/clam-chowder.jpg' },
          { name: 'Mission Burrito', imageUrl: '/images/mission-burrito.jpg' },
          { name: 'Dungeness Crab', imageUrl: '/images/dungeness-crab.jpg' }
        ]
      },
      {
        name: 'Las Vegas',
        slug: 'las-vegas',
        description: 'Las Vegas, gece hayatı ve kumarhaneleriyle ünlüdür.',
        imageUrl: '/images/las-vegas.jpg',
        countrySlug: 'abd',
        famousDishes: [
          { name: 'Shrimp Cocktail', imageUrl: '/images/shrimp-cocktail.jpg' },
          { name: 'Prime Rib', imageUrl: '/images/prime-rib.jpg' },
          { name: 'Buffet Feast', imageUrl: '/images/buffet-feast.jpg' }
        ]
      },
      {
        name: 'Miami',
        slug: 'miami',
        description: 'Miami, plajları ve Latin kültürüyle dikkat çeker.',
        imageUrl: '/images/miami.jpg',
        countrySlug: 'abd',
        famousDishes: [
          { name: 'Cuban Sandwich', imageUrl: '/images/cuban-sandwich.jpg' },
          { name: 'Stone Crab', imageUrl: '/images/stone-crab.jpg' },
          { name: 'Key Lime Pie', imageUrl: '/images/key-lime-pie.jpg' }
        ]
      },
      {
        name: 'Kyoto',
        slug: 'kyoto',
        description: 'Kyoto, geleneksel Japon kültürünün merkezlerinden biridir.',
        imageUrl: '/images/kyoto.jpg',
        countrySlug: 'japonya',
        famousDishes: [
          { name: 'Yudofu', imageUrl: '/images/yudofu.jpg' },
          { name: 'Kaiseki', imageUrl: '/images/kaiseki.jpg' },
          { name: 'Matcha Tatlıları', imageUrl: '/images/matcha-desserts.jpg' }
        ]
      },
      {
        name: 'Osaka',
        slug: 'osaka',
        description: 'Osaka, Japonya\'nın sokak yemekleriyle ünlü şehridir.',
        imageUrl: '/images/osaka.jpg',
        countrySlug: 'japonya',
        famousDishes: [
          { name: 'Takoyaki', imageUrl: '/images/takoyaki.jpg' },
          { name: 'Okonomiyaki', imageUrl: '/images/okonomiyaki.jpg' },
          { name: 'Kushikatsu', imageUrl: '/images/kushikatsu.jpg' }
        ]
      },
      {
        name: 'Hiroşima',
        slug: 'hirosima',
        description: 'Hiroşima, barış anıtı ve lezzetli mutfağıyla ünlüdür. 2. Dünya Savaşında atom bombası atılan bir ülkedir.',
        imageUrl: '/images/hirosima.jpg',
        countrySlug: 'japonya',
        famousDishes: [
          { name: 'Hiroşima Usulü Okonomiyaki', imageUrl: '/images/hirosima-okonomiyaki.jpg' },
          { name: 'Oyster Dishes', imageUrl: '/images/oyster-dishes.jpg' },
          { name: 'Tsukemen', imageUrl: '/images/tsukemen.jpg' }
        ]
      },
      {
        name: 'Sapporo',
        slug: 'sapporo',
        description: 'Sapporo, Japonya\'nın kış festivalleriyle ünlü bir şehridir.',
        imageUrl: '/images/sapporo.jpg',
        countrySlug: 'japonya',
        famousDishes: [
          { name: 'Miso Ramen', imageUrl: '/images/miso-ramen.jpg' },
          { name: 'Genghis Khan (Jingisukan)', imageUrl: '/images/jingisukan.jpg' },
          { name: 'Sapporo Beer', imageUrl: '/images/sapporo-beer.jpg' }
        ]
      }
];

const countries = [
    { name: 'Türkiye', slug: 'turkiye', description: 'Türkiye, Asya ve Avrupa kıtalarını birleştiren bir ülkedir.', imageUrl: '/images/turkiye.jpg', cities: ['Kapadokya', 'Antalya', 'İzmir', 'Trabzon', 'İstanbul'] },
    { name: 'Fransa', slug: 'fransa', description: 'Fransa, Avrupa\'nın batısında yer alan bir ülkedir.', imageUrl: '/images/fransa.jpg', cities: ['Paris', 'Nice', 'Lyon', 'Bordeaux', 'Strasbourg'] },
    { name: 'Japonya', slug: 'japonya', description: 'Japonya, Doğu Asya\'da bir ada ülkesidir.', imageUrl: '/images/japonya.jpg', cities: ['Tokyo', 'Kyoto', 'Osaka', 'Hiroşima', 'Sapporo'] },
    { name: 'İtalya', slug: 'italya', description: 'İtalya, Akdeniz\'de bir yarımada ülkesidir.', imageUrl: '/images/italya.jpg', cities: ['Roma', 'Venedik', 'Floransa', 'Milano', 'Napoli'] },
    { name: 'ABD', slug: 'abd', description: 'ABD, Kuzey Amerika\'da bir ülkedir.', imageUrl: '/images/abd.jpg', cities: ['New York', 'Los Angeles', 'San Francisco', 'Las Vegas', 'Miami'] }
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
