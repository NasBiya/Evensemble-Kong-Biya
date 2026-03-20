const express = require('express');
const router = express.Router();
const User = require('../models/User');

const { authMiddleware } = require('./auth'); 

// Récupérer les favoris du user connecté
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json(user.favoris || []);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

//  Ajouter un favori
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    //Si l'utilisateur n'existe plus dans la DB
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable. Veuillez vous reconnecter." });
    }

    // On s'assure que le tableau existe
    if (!user.favoris) {
      user.favoris = [];
    }

    const event = req.body;

    // On ajoute s'il n'y est pas déjà
    if (!user.favoris.find(f => f.id === event.id)) {
      user.favoris.push(event);
      await user.save();
    }
    
    res.json(user.favoris);
  } catch (error) {
    // la raison de l'erreur dans terminal Node.js !
    console.error("Erreur Backend Favoris :", error); 
    res.status(500).json({ message: 'Erreur serveur!' });
  }
});

// Supprimer un favori
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.favoris = user.favoris.filter(f => f.id !== req.params.id);
    await user.save();
    res.json(user.favoris);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;