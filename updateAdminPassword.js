const mongoose = require('mongoose');

// MongoDB bağlantı URL'si
const MONGODB_URI = 'mongodb+srv://yeldaozd2:1234@cluster0.j1mpx.mongodb.net/travel-guide?retryWrites=true&w=majority';

async function updateAdminPassword() {
    try {
        // MongoDB'ye bağlan
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB\'ye bağlandı');

        // User modelini yükle
        const User = require('./models/User');

        // Admin kullanıcısını bul
        const adminUser = await User.findOne({ email: 'yeldaozdmrr3434@gmail.com' });
        
        if (!adminUser) {
            console.log('Admin kullanıcısı bulunamadı');
            return;
        }

        // Şifreyi düz metin olarak güncelle
        adminUser.password = 'yelda2306';
        await adminUser.save();

        console.log('Admin şifresi başarıyla güncellendi');
    } catch (error) {
        console.error('Hata:', error);
    } finally {
        // Bağlantıyı kapat
        await mongoose.connection.close();
        console.log('MongoDB bağlantısı kapatıldı');
    }
}

// Fonksiyonu çalıştır
updateAdminPassword(); 