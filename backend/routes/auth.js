const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// AUTHENTICATION MIDDLEWARE
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Pas de token, autorisation refusée' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

// Inscription d'utilisateur
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Utilisateur est déjà exitant' });
    }

    user = new User({ email, password });
    await user.save();

    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur lors inscription', error: error.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mdp invalide' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mdp invalide' });
    }

    const payload = {
      userId: user._id,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Connexion est réussite', token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur lors connexion', error: error.message });
  }
});

// Déconnexion
router.post('/logout', authMiddleware, (req, res) => {
  try {
    res.json({ message: 'Déconnexion faite' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur lors déconnexion', error: error.message });
  }
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;