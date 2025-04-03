const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Geçici depolama için diskStorage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/uploads/temp';
        // Eğer klasör yoksa oluştur
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Dosya adını slug formatına çevir
        const nameWithoutExt = path.parse(file.originalname).name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        
        // Dosya uzantısını al
        const ext = path.extname(file.originalname).toLowerCase();
        
        // Benzersiz bir isim oluştur
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        
        cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
    }
});

// Dosya filtreleme
const fileFilter = (req, file, cb) => {
    // İzin verilen dosya tipleri
    const allowedTypes = /jpeg|jpg|png|gif/;
    
    // Dosya uzantısı ve MIME tipini kontrol et
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Sadece resim dosyaları yüklenebilir! (JPEG, JPG, PNG, GIF)'), false);
    }
};

// Multer konfigürasyonu
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Resim sıkıştırma fonksiyonu
const compressImage = async (req, res, next) => {
    if (!req.file) return next();

    try {
        // Yüklenmiş dosyanın yolu
        const tempPath = req.file.path;
        
        // Optimize edilmiş dosyanın hedef yolu
        const targetDir = 'public/images';
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Dosya adını al
        const filename = req.file.filename;
        const targetPath = path.join(targetDir, filename);
        
        // Dosyanın uzantısını kontrol et
        const ext = path.extname(filename).toLowerCase();
        
        // Sharp ile görselleştirme işlemi
        if (ext === '.gif') {
            // GIF dosyaları için basit kopyalama (Sharp GIF'leri iyi işleyemez)
            fs.copyFileSync(tempPath, targetPath);
        } else {
            // JPEG, PNG ve diğerleri için Sharp kullan
            await sharp(tempPath)
                .resize(1200, 800, { // Maksimum genişlik ve yükseklik
                    fit: sharp.fit.inside,
                    withoutEnlargement: true
                })
                .jpeg({ quality: 80 }) // JPEG kalitesi (80% iyi bir denge)
                .toFile(targetPath);
        }
        
        // Geçici dosyayı sil
        fs.unlinkSync(tempPath);
        
        // Dosya yolunu güncelle
        req.file.path = targetPath;
        
        next();
    } catch (error) {
        console.error('Resim sıkıştırma hatası:', error);
        next(error);
    }
};

module.exports = { upload, compressImage }; 