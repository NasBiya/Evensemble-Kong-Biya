const express = require('express');
const axios = require('axios');
const router = express.Router();

//Recevoir une liste d'adresses et renvoyer leurs coordonnées GPS
router.post('/bulk', async (req, res) => {
  // On récupère le tableau d'adresses envoyé par Angular
  const { addresses } = req.body;

  const results = [];

  await Promise.all(addresses.map(async (item) => {
    try {
      // On interroge SerpApi avec le moteur Google Maps
      const response = await axios.get(process.env.SERP_BASE_URL, {
        params: {
          engine: 'google_maps',
          q: item.address,
          api_key: process.env.GOOGLE_API_KEY,
        }
      });

      // On fouille dans la réponse complexe de SerpApi pour trouver les infos du lieu
      // On regarde d'abord dans "local_results", sinon dans "place_results"
      const place = response.data.local_results?.[0] ?? response.data.place_results;
      const coords = place?.gps_coordinates;

      // ajoute les coordonnées trouvées dans notre tableau de résultats
      results.push({
        id: item.id,
        lat: coords?.latitude ?? null,
        lon: coords?.longitude ?? null
      });
    } catch (err) {
      console.error(`Echoué pour "${item.address}":`, err.message);
      results.push({ id: item.id, lat: null, lon: null });
    }
  }));

  res.json(results);
});

module.exports = router;