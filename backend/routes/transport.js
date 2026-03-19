const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
    // 1. On récupère le nouveau paramètre "departure_time"
    const { depart, arrivee, mode, departure_time } = req.query;
    
    try {
        // 2. On prépare les paramètres pour SerpApi
        const params = {
            engine: 'google_maps_directions',
            start_addr: depart,
            end_addr: arrivee,
            travel_mode: mode || 3, // 0=Voiture, 1=Vélo, 2=Marche, 3=Métro
            hl: 'fr',
            gl: 'fr',
            api_key: process.env.GOOGLE_API_KEY,
        };

        // 3. Si une date/heure a été choisie, on l'ajoute à Google Maps !
        if (departure_time) {
            params.departure_time = departure_time;
        }

        const response = await axios.get('https://serpapi.com/search.json', { params });
        
        res.json(response.data.directions || []);
    } catch (error) {
        console.error("Erreur API Directions :", error.message);
        res.status(500).json({ error: 'Failed to fetch directions' });
    }
});

module.exports = router;