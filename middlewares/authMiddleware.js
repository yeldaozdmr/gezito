// Admin yetkisi kontrolü
function ensureAdmin(req, res, next) {
    // Önce oturum kontrolü
    if (!req.session || !req.session.userId) {
        console.log('Oturum bulunamadı:', req.session);
        return res.redirect('/giris');
    }

    // Sonra admin yetkisi kontrolü
    if (req.session.role === 'admin') {
        return next();
    }

    // Yetkisiz erişim
    console.log('Yetkisiz erişim denemesi:', req.session);
    return res.status(403).send('Bu sayfaya erişim izniniz yok.');
}

module.exports = {
    ensureAdmin
};
