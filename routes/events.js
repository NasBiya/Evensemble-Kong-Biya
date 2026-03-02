const express = require('express');
const router = express.Router();

router.get('/api/events', async (req, res) => {
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

module.exports = router;