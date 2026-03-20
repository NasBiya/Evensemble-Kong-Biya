// biblio mongoose, traduit les code de js en commandes que la base de données peut comprendre
// importe Mongoose
const mongoose = require('mongoose');

// Connexion asynchrone à la base de données, en attendant du retour de MongoDB
// car la connexion prend un peu de temps
const connectDB = async () => {
  try {
    // en utilisant de URL de mongo défini en .env pour la connexion
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('la connexion à MongoDB est réussite');
  } catch (err) {
    console.error('Erreur de connexion de MongoDB:', err.message);
    process.exit(1);
  }
};

// On exporte la fonction pour pouvoir l'utiliser
module.exports = connectDB;