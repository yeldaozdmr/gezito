/**
 * Bu script, mevcut resim dosyalarını sıkıştırmak için kullanılır.
 * Komut satırından çalıştırılabilir: node utils/imageOptimizer.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Sıkıştırılacak dizin
const sourceDir = path.join(__dirname, '../public/images');
// Sıkıştırılmış resimlerin kaydedileceği dizin
const targetDir = path.join(__dirname, '../public/images_optimized');

// Klasör yoksa oluştur
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Resimleri sıkıştırma fonksiyonu
async function optimizeImages() {
    try {
        // Klasördeki tüm dosyaları oku
        const files = fs.readdirSync(sourceDir);
        
        console.log(`Toplam ${files.length} resim bulundu.`);
        let processedCount = 0;
        let errorCount = 0;
        
        // Her dosya için sıkıştırma işlemi uygula
        for (const file of files) {
            const sourcePath = path.join(sourceDir, file);
            const targetPath = path.join(targetDir, file);
            
            // Sadece dosyalar için işlem yap
            if (fs.statSync(sourcePath).isFile()) {
                const ext = path.extname(file).toLowerCase();
                
                try {
                    // GIF dosyaları için basit kopyalama
                    if (ext === '.gif') {
                        fs.copyFileSync(sourcePath, targetPath);
                        console.log(`${file} kopyalandı.`);
                    } 
                    // Diğer resim dosyaları için sıkıştırma
                    else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                        await sharp(sourcePath)
                            .resize(1200, 800, {
                                fit: sharp.fit.inside,
                                withoutEnlargement: true
                            })
                            .jpeg({ quality: 80 })
                            .toFile(targetPath);
                        console.log(`${file} sıkıştırıldı.`);
                    } 
                    // Diğer dosyaları atla
                    else {
                        console.log(`${file} desteklenmeyen format, atlanıyor.`);
                        continue;
                    }
                    
                    processedCount++;
                } catch (error) {
                    console.error(`Hata: ${file} işlenirken sorun: ${error.message}`);
                    errorCount++;
                }
            }
        }
        
        console.log('\nİşlem tamamlandı');
        console.log(`İşlenen resim sayısı: ${processedCount}`);
        console.log(`Hatalı resim sayısı: ${errorCount}`);
        console.log(`Sıkıştırılmış resimler şu dizinde bulunabilir: ${targetDir}`);
        
    } catch (error) {
        console.error('Bir hata oluştu:', error);
    }
}

// Script'i çalıştır
optimizeImages().catch(console.error);

// Kullanım Talimatları
console.log(`
Resim Sıkıştırma Aracı
======================

Bu araç, ${sourceDir} dizinindeki tüm resimleri sıkıştırarak 
${targetDir} dizinine kaydeder.

İşlem tamamlandıktan sonra, sıkıştırılmış dosyaları orijinal dosyalarla değiştirmek için:
1. Orijinal dizindeki resimleri yedekleyin (isteğe bağlı)
2. Sıkıştırılmış resimleri orijinal dizine kopyalayın

Not: Bu işlem, resimlerin kalitesinde hafif bir düşüş yaratabilir ancak dosya boyutlarını önemli ölçüde küçültecektir.
`); 