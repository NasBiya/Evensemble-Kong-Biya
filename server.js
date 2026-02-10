require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const SERP_BASE_URL = 'https://serpapi.com/search.json';

app.use(cors());
app.use(express.json());

app.get('/api/events', async (req, res) => {
    const { query } = req.query;
    
    try {
        const response = await axios.get(SERP_BASE_URL, {
            params: {
                engine: 'google_events',
                q: query,
                api_key: process.env.GOOGLE_API_KEY,
                gl: 'fr',
            }
        });
        
        res.json(response.data.events_results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
