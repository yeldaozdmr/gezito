function ensureAdmin(req, res, next) {
    if (req.session.role === 'admin') {
        return next();
    }
    console.log('Yetkisiz erişim denemesi:', req.session);
    res.status(403).send('Bu sayfaya erişim izniniz yok.');
}

module.exports = { ensureAdmin };
