const User = require('../models/User');
const Comment = require('../models/Comment');
const City = require('../models/City');

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
        console.log('Login attempt for:', email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).send('Kullanıcı bulunamadı');
        }

        console.log('User found:', {
            id: user._id,
            role: user.role,
            username: user.username
        });

        // Şifre karşılaştırması (comparePassword metodu User modelinde tanımlanmalı)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(400).send('Şifre hatalı');
        }

        // Session'a kullanıcı bilgilerini kaydet
        req.session.userId = user._id;
        req.session.role = user.role;
        req.session.username = user.username;

        console.log('Session created:', {
            userId: req.session.userId,
            role: req.session.role,
            username: req.session.username
        });

        // Kullanıcı rolüne göre yönlendir
        if (user.role === 'admin') {
            console.log('Redirecting to admin panel');
            res.redirect('/admin');
        } else {
            console.log('Redirecting to homepage');
            res.redirect('/');
        }
    } catch (err) {
        console.error('Login error:', err);
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
    res.render('contact', { successMessage: 'Mesajınız başarıyla gönderildi!' });
}

// Yorum gönderimi
async function addComment(req, res) {
    const { content, citySlug, countryId } = req.body;

    if (!req.session.userId) {
        return res.status(403).send('Yorum yapabilmek için giriş yapmalısınız.');
    }

    // Yorum uzunluğunu kontrol et
    if (content.length > 370) {
        return res.status(400).send('Yorum maksimum 370 karakter olmalıdır.');
    }

    try {
        const city = await City.findOne({ slug: citySlug });
        if (!city) {
            return res.status(404).send('Şehir bulunamadı');
        }

        const newComment = new Comment({
            userId: req.session.userId,
            content,
            cityId: city._id,
            countryId
        });
        await newComment.save();
        
        // Yorum yapıldıktan sonra ilgili sayfaya yönlendir
        if (city) {
            return res.redirect(`/sehir/${city.slug}`);
        } else if (countryId) {
            return res.redirect(`/ulke/${countryId}`);
        }
        
        res.status(201).send('Yorumunuz başarıyla gönderildi!');
    } catch (err) {
        console.error('Yorum gönderiminde hata:', err);
        res.status(500).send('Yorum gönderiminde bir hata oluştu: ' + err.message);
    }
}

module.exports = {
    register,
    login,
    logout,
    iletisim,
    addComment
};