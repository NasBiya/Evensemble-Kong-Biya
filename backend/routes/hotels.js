//api hotel
const express = require('express');
const axios = require('axios');
const router = express.Router();


router.get('/hotels', async (req, res) => {
    // On récupère les critères de recherche envoyés par le Frontend dans l'URL
    const { city, check_in, check_out } = req.query;
    
    try {
        // On interroge SerpApi avec le moteur de recherche d'hôtels
        const response = await axios.get(process.env.SERP_BASE_URL, {
            params: {
                engine: 'google_hotels', 
                q: `${city}`,
                check_in_date: check_in,
                check_out_date: check_out,
                api_key: process.env.GOOGLE_API_KEY,
                currency: 'EUR',
                gl: 'fr',
            }
        });
        // SerpApi renvoie beaucoup de données (carte, filtres, etc.). 
        // On isole et on renvoie uniquement la liste des hôtels (contenue dans "properties")
        res.json(response.data.properties);
    } catch (error) {
        res.status(500).json({ error: 'Échec de la récupération des hôtels' });
    }
});

module.exports = router;