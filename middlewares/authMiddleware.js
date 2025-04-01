// Admin yetkisi kontrolü middleware'i
const requireAdmin = (req, res, next) => {
    console.log('Session durumu:', {
        session: req.session,
        userId: req.session?.userId,
        role: req.session?.role,
        isAuthenticated: !!req.session?.userId
    });

    // Önce oturum kontrolü
    if (!req.session || !req.session.userId) {
        console.log('Oturum bulunamadı:', req.session);
        return res.redirect('/giris');
    }

    // Admin rolü kontrolü
    if (req.session.role !== 'admin') {
        console.log('Admin yetkisi yok:', req.session);
        return res.status(403).json({
            success: false,
            message: 'Bu sayfaya erişim izniniz yok.'
        });
    }

    // Tüm kontroller başarılı, devam et
    next();
};

// Oturum kontrolü middleware'i
const ensureAuth = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        console.log('Oturum bulunamadı:', req.session);
        return res.redirect('/giris');
    }
    next();
};

module.exports = {
    requireAdmin,
    ensureAuth
};
