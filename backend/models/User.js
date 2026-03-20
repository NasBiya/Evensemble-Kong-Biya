const mongoose = require('mongoose');
// outil de cryptographie qui chiffre le mdp
const bcrypt = require('bcryptjs');

// schéma/la structure de base de données
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, 
    trim: true, // Enlève les espaces tapés par erreur au début et à la fin
    lowercase: true //email convertit en minuscules
  },
  password: {
    type: String,
    required: true
  },

  // Tableau contenant les événements favoris de l'utilisateur
  favoris: [{
    id: { type: String, required: true }, // L'ID ou lien unique de SerpApi
    title: String,
    thumbnail: String, // Image de l'événement
    displayDate: String,
    location: String,
    link: String // Lien pour plus d'infos
  }]
});

// La fonction s'exécute automatiquement juste avant de sauvegarder un utilisateur dans la base
UserSchema.pre('save', async function() {
  // Si le mot de passe n'a pas été modifié, on arrête ici pour ne pas recrypter
  if (!this.isModified('password')) return;

  try {
    // On génère du "sel": c'est une donnée aléatoire qui rend le cryptage encore plus complexe
    const salt = await bcrypt.genSalt(10);
    // On remplace le mot de passe en clair par le mot de passe crypté
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

// On ajoute une fonction "comparePassword" à notre moule utilisateur
// pour comparer à chaque connexion le mots de passe
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);