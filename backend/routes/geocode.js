const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/bulk', async (req, res) => {
  const { addresses } = req.body;

  const results = [];

  await Promise.all(addresses.map(async (item) => {
    try {
      const response = await axios.get(process.env.SERP_BASE_URL, {
        params: {
          engine: 'google_maps',
          q: item.address,
          api_key: process.env.GOOGLE_API_KEY,
        }
      });

      const place = response.data.local_results?.[0] ?? response.data.place_results;
      const coords = place?.gps_coordinates;

      results.push({
        id: item.id,
        lat: coords?.latitude ?? null,
        lon: coords?.longitude ?? null
      });
    } catch (err) {
      console.error(`Failed for "${item.address}":`, err.message);
      results.push({ id: item.id, lat: null, lon: null });
    }
  }));

  res.json(results);
});

module.exports = router;