// Admin yetkisi kontrolü middleware'i
const ensureAdmin = (req, res, next) => {
    // Önce oturum kontrolü
    if (!req.session || !req.session.userId) {
        console.log('Oturum bulunamadı');
        return res.redirect('/giris');
    }

    // Admin rolü kontrolü
    if (req.session.role !== 'admin') {
        console.log('Admin yetkisi yok:', req.session);
        return res.status(403).send('Bu sayfaya erişim izniniz yok.');
    }

    // Tüm kontroller başarılı, devam et
    next();
};

module.exports = {
    ensureAdmin
};
