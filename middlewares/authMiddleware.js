const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");

    // Token var mı?
    if (!authHeader) {
        return res.status(401).json({ message: "Yetkilendirme reddedildi! Token bulunamadı." });
    }

    // "Bearer <TOKEN>" formatında geliyor, "Bearer " kısmını ayıkla
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Yetkilendirme reddedildi! Geçersiz token formatı." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "gizli_anahtar"); // .env'den çek
        req.user = decoded; // Kullanıcı bilgilerini req içine ekle
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Oturum süresi doldu! Tekrar giriş yapın." });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Geçersiz token!" });
        } else {
            return res.status(500).json({ message: "Sunucu hatası!", error: error.message });
        }
    }
};
