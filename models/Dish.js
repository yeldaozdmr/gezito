const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    // Diğer alanlar...
});

module.exports = mongoose.model('Dish', dishSchema); 