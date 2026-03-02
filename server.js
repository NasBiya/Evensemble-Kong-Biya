require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const SERP_BASE_URL = 'https://serpapi.com/search.json';

app.use(cors());
app.use(express.json());

// connexion à mangodb
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB avec succès !'))
  .catch((err) => console.error('Erreur de connexion MongoDB :', err));

//API evenement
app.get('/api/events', async (req, res) => {
    const { query } = req.query;
    
    try {
        const response = await axios.get(SERP_BASE_URL, {
            params: {
                engine: 'google_events',
                q: query,
                api_key: process.env.GOOGLE_API_KEY,
             
            }
        });
        
        res.json(response.data.events_results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

//api hotel
app.get('/api/hotels', async (req, res) => {
    const { city, check_in, check_out } = req.query;
    
    try {
        const response = await axios.get(SERP_BASE_URL, {
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

        res.json(response.data.properties);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hotels' });
    }
});

//pour transport
app.get('/api/transport', async (req, res) => {
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
    // Note : SerpApi attend des "Timestamp" (format numérique) ou "now"
    
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
        const response = await axios.get(SERP_BASE_URL, { params: serpParams });
        res.json(response.data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération du trajet' });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarre sur la porte http://localhost:${PORT}`);
});
