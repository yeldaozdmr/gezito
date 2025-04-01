# Gezi Rehberi Projesi

## Proje Hakkında
Bu proje, kullanıcıların farklı ülke ve şehirler hakkında bilgi edinebileceği, gezi deneyimlerini paylaşabileceği bir web platformudur.

## Kullanılan Teknolojiler

### Backend
- Node.js
- Express.js
- MongoDB (Veritabanı)
- Express-session (Oturum yönetimi)

### Frontend
- EJS (Template Engine)
- HTML/CSS
- TailwindCSS
- JavaScript

### Güvenlik
- Özel middleware'ler (authMiddleware)
- Şifre hashleme olmasın

## Proje Yapısı

### Models
- User (Kullanıcı modeli)
- Country (Ülke modeli)
- City (Şehir modeli)

### Controllers
- adminController (Admin panel işlemleri)
- Kullanıcı yönetimi
- Ülke ve şehir ekleme/düzenleme işlemleri

### Özellikler
- Admin paneli
- Kullanıcı girişi
- Ülke ve şehir yönetimi
- SEO dostu URL'ler (slug yapısı)

## Geliştirilmesi Planlanan Özellikler
- [ ] Kullanıcı yorumları
- [ ] Fotoğraf yükleme
- [ ] Gezi rotaları
- [ ] Kullanıcı profilleri
- [ ] Favori yerler listesi

## Kurulum
```bash
npm install
npm start
```

## Katkıda Bulunma
Projeye katkıda bulunmak için pull request gönderebilirsiniz.

## Lisans
Bu proje MIT lisansı altında lisanslanmıştır. 