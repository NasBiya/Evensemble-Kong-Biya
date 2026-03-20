// Importation des bibliothèques
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./config/db");

// Initialisation de l'application
const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à la base de données MongoDB
connectDB();

// MiddleWares/ les fonctions qui s'exécutent "au milieu", avant d'atteindre les routes
// Autorise les requêtes provenant d'autres domaines
app.use(cors());
// Traduit automatiquement les données entrantes au format JSON
app.use(express.json());

// Routages
// On redirige les requêtes vers les fichiers spécifiques correspondants dans le dossier "routes"
app.use("/api/auth", require("./routes/auth"));
app.use("/api/hotels", require("./routes/hotels"));
app.use("/api/events", require("./routes/events"));
// Gère la transformation d'adresses en coordonnées GPS (Lat/Lng)
app.use("/api/geocode", require("./routes/geocode"));
app.use("/api/transport", require("./routes/transport"));
app.use('/api/favorites', require('./routes/favoris'));

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarre sur la porte http://localhost:${PORT}`);
});
