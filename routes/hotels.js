//api hotel
const express = require('express');
const axios = require('axios');
const router = express.Router();


router.get('/hotels', async (req, res) => {
    const { city, check_in, check_out } = req.query;
    
    try {
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

        res.json(response.data.properties);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hotels' });
    }
});

module.exports = router;