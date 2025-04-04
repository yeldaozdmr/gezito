const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    resetToken: {
        type: String,
        default: null
    },
    resetTokenExpiry: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// Şifre karşılaştırma metodu - plain text karşılaştırma
userSchema.methods.comparePassword = function(candidatePassword) {
    // Şifreyi sıkı bir şekilde karşılaştır (===)
    return String(this.password) === String(candidatePassword);
};

module.exports = mongoose.model('User', userSchema);