const User = require('../models/User');
const Comment = require('../models/Comment');

async function register(req, res) {
    const { username, email, password } = req.body;

    // Kullanıcı adı uzunluğunu kontrol et
    if (username.length < 4 || username.length > 25) {
        return res.status(400).send('Kullanıcı adı 4 ile 25 karakter arasında olmalıdır.');
    }

    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).redirect('/');
    } catch (err) {
        console.error(err); // Hata mesajını konsola yazdır
        res.status(500).send('Kayıt sırasında bir hata oluştu: ' + err.message);
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Kullanıcı bulunamadı');
        }
        if (user.password !== password) {
            return res.status(400).send('Şifre hatalı');
        }
        req.session.userId = user._id; // Oturum açma işlemi
        req.session.username = user.username; // Kullanıcı adını oturuma ekleyin
        res.redirect('/'); // Anasayfaya yönlendir
    } catch (err) {
        console.error(err); // Hata mesajını konsola yazdır
        res.status(500).send('Giriş sırasında bir hata oluştu: ' + err.message);
    }
}

function logout(req, res) {
    req.session.destroy();
    res.redirect('/'); // Anasayfaya yönlendir
}

// İletişim formu gönderimi
async function iletisim(req, res) {
    const { name, email, message } = req.body;

    // Burada form verilerini işleyebilirsiniz (örneğin, veritabanına kaydetme veya e-posta gönderme)
    console.log(`İsim: ${name}, E-posta: ${email}, Mesaj: ${message}`);

    // Başarılı bir şekilde gönderildiğinde kullanıcıyı bilgilendirin
    res.send('Mesajınız başarıyla gönderildi!');
}

// Yorum gönderimi
async function addComment(req, res) {
    const { content, cityId, countryId } = req.body;

    if (!req.session.userId) {
        return res.status(403).send('Yorum yapabilmek için giriş yapmalısınız.');
    }

    // Yorum uzunluğunu kontrol et
    if (content.length > 370) {
        return res.status(400).send('Yorum maksimum 370 karakter olmalıdır.');
    }

    try {
        const newComment = new Comment({
            userId: req.session.userId,
            content,
            cityId,
            countryId
        });
        await newComment.save();
        res.status(201).send('Yorumunuz başarıyla gönderildi!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Yorum gönderiminde bir hata oluştu: ' + err.message);
    }
}

module.exports = {
    register,
    login,
    logout,
    iletisim,
    addComment // Yeni fonksiyonu dışa aktar
};