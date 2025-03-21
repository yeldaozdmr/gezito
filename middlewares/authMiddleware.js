function ensureAdmin(req, res, next) {
    // Önce oturum kontrolü
    if (!req.session || !req.session.userId) {
        console.log('Oturum bulunamadı:', req.session);
        return res.redirect('/login');
    }

    // Sonra admin rolü kontrolü
    if (req.session.role !== 'admin') {
        console.log('Admin yetkisi yok:', req.session);
        return res.status(403).send('Bu sayfaya erişim izniniz yok.');
    }

    next();
}

module.exports = { ensureAdmin };
