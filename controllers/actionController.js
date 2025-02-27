const User = require('../models/User');


async function register (req, res) {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).redirect('/');
    } catch (err) {
        console.error(err); // Hata mesajını konsola yazdır
        res.status(500).send('Kayıt sırasında bir hata oluştu: ' + err.message);
    }
}

async function login (req, res) {
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
        res.redirect('/'); // Anasayfaya yönlendir
    } catch (err) {
        console.error(err); // Hata mesajını konsola yazdır
        res.status(500).send('Giriş sırasında bir hata oluştu: ' + err.message);
    }
}

function logout (req, res) {
    req.session.destroy();
    res.redirect('/'); // Anasayfaya yönlendir
}

module.exports = {
    register,
    login,
    logout
};