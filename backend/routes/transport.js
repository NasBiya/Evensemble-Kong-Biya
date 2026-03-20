const express = require('express');
const router = express.Router();
const axios = require('axios');

//Calculer un itinéraire entre deux adresses selon un mode de transport
router.get('/', async (req, res) => {
    // On récupère les critères de recherche envoyés par Angular dans l'URL
    const { depart, arrivee, mode, departure_time } = req.query;
    
    try {
        // On prépare les paramètres
        const params = {
            engine: 'google_maps_directions',
            start_addr: depart,
            end_addr: arrivee,
            travel_mode: mode || 3, // 0=Voiture, 1=Vélo, 2=Marche, 3=Métro et 3 par défaut
            hl: 'fr',
            gl: 'fr',
            api_key: process.env.GOOGLE_API_KEY,
        };

        // Si Angular nous a envoyé un Timestamp (demain matin),
        // on l'ajoute à nos paramètres. Sinon, Google Maps calculera pour "maintenant".
        if (departure_time) {
            params.departure_time = departure_time;
        }

        // On envoie la requête à SerpApi avec tous nos paramètres
        const response = await axios.get('https://serpapi.com/search.json', { params });
        
        // On renvoie uniquement le tableau des itinéraires ("directions") au Frontend.
        // Si SerpApi ne trouve aucune route (trajet impossible), on renvoie un tableau vide "[]"
        res.json(response.data.directions || []);
    } catch (error) {
        console.error("Erreur API Directions :", error.message);
        res.status(500).json({ error: 'Échec du calcul de l\'itinéraire' });
    }
});

module.exports = router;