const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');



// Kullanıcı kaydı
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).send('Kullanıcı başarıyla kaydedildi');
    } catch (err) {
        console.error(err); // Hata mesajını konsola yazdır
        res.status(500).send('Kayıt sırasında bir hata oluştu: ' + err.message);
    }
});

// Kullanıcı girişi
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Kullanıcı bulunamadı');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Şifre hatalı');
        }
        req.session.userId = user._id; // Oturum açma işlemi
        res.redirect('/'); // Anasayfaya yönlendir
    } catch (err) {
        console.error(err); // Hata mesajını konsola yazdır
        res.status(500).send('Giriş sırasında bir hata oluştu: ' + err.message);
    }
});

// Çıkış yapma
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/'); // Anasayfaya yönlendir
});

module.exports = router; 
