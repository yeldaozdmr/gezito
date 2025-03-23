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
<<<<<<< HEAD
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

// Şifre karşılaştırma metodu - plain text karşılaştırma
userSchema.methods.comparePassword = function(candidatePassword) {
    return this.password === candidatePassword;
};

=======
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

>>>>>>> 76da1f5b4c100e2b49652cf707da52a9da980136
module.exports = mongoose.model('User', userSchema);