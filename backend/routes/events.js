const express = require('express');
const router = express.Router();

// Outil pour faire des requêtes HTTP vers d'autres serveurs
const axios = require('axios');
// Chercher des événements via l'API externe SerpApi
router.get('/', async (req, res) => {
    // On récupère le paramètre "query" envoyé dans l'URL par le Frontend
    const { query } = req.query;
    
    try {
        // On envoie une requête GET à SerpApi avec Axios
        const response = await axios.get(process.env.SERP_BASE_URL, {
            params: {
                engine: 'google_events',
                q: query,
                hl: "en",
                gl: "us",
                api_key: process.env.GOOGLE_API_KEY,
            }
        });
        // SerpApi renvoie beaucoup d'informations inutiles (métadonnées). 
        // On ne renvoie au Frontend QUE le tableau qui contient les événements ("events_results").
        res.json(response.data.events_results);
    } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        res.status(500).json({ error: 'Echoué pour aller chercher des évènement' });
    }
});

module.exports = router;