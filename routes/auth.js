const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Kayıt olma
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Giriş yapma
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).send('Kullanıcı bulunamadı');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Geçersiz şifre');
        }

        req.session.userId = user._id;
        res.redirect('/');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Çıkış yapma
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router; 