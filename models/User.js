const mongoose = require('mongoose');

// On définit le "moule" d'un utilisateur
const userSchema = new mongoose.Schema({
  identifiant: { 
    type: String, 
    required: true, 
    unique: true // Impossible d'avoir 2 fois le même identifiant
  },
  password: { 
    type: String, 
    required: true 
  },
  // Le tableau qui stockera les ID des événements favoris
  favoris: [{ 
    type: Number 
  }] 
});

module.exports = mongoose.model('User', userSchema);