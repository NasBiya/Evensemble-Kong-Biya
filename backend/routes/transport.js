const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/api/transport', async (req, res) => {
    // On récupère les nouveaux paramètres depuis l'URL
    const { start, end, mode, prefer, depart_at, arrive_by } = req.query;
    
    if (!start || !end) {
        return res.status(400).json({ error: 'Il manque le départ ou l\'arrivée.' });
    }

    // Préparation des paramètres pour SerpApi
    let serpParams = {
        engine: 'google_maps_directions',
        start_addr: start,
        end_addr: end,
        travel_mode: (mode === 'transit' || !mode) ? '3' : mode, // 'transit' par défaut -> transit = 3
        api_key: process.env.GOOGLE_API_KEY,
        hl: 'fr',
        gl: 'fr'
    };

    // GESTION DES PRÉFÉRENCES
    if (prefer) {
        serpParams.transit_mode = prefer; 
    }

    // GESTION DES HORAIRES
    if (arrive_by) {
        // Arriver à une heure précise
        serpParams.arrival_time = arrive_by;
    } else if (depart_at) {
        // Partir à une heure précise
        serpParams.departure_time = depart_at;
    } else {
        // Sinon, par défaut (départ immédiat)
        serpParams.departure_time = 'now';
    }

    try {
        const response = await axios.get(process.env.SERP_BASE_URL, { params: serpParams });
        res.json(response.data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération du trajet' });
    }
});

module.exports = router;