# Evensemble

**Une application web pour découvrir des événements, réserver des hôtels et organiser votre transport en un seul endroit.**

---

## À propos

Evensemble est une plateforme tout-en-un conçue pour simplifier la planification de voyages. Les utilisateurs peuvent:

1. **Découvrir des événements** dans n'importe quelle ville
2. **Trouver des hôtels** adaptés à leurs besoins
3. **Rechercher des moyens de transport** pour se déplacer
4. **Sauvegarder leurs favoris** pour plus tard

L'application utilise l'API **SerpApi** pour accéder à des données en temps réel (Google Events, Google Hotels, Google Maps).

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de données:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Password hashing:** bcrypt
- **External API:** SerpApi

### Frontend
- **Framework:** Angular
- **Language:** TypeScript

---

## 💻 Installation

### Prérequis
- Node.js (v14+)
- MongoDB (local ou Atlas)
- npm ou yarn
- Une clé API SerpApi

### Backend Setup

```bash
# Accéder au dossier backend
cd backend

# Installer les dépendances
npm install

# Créer un fichier .env
# MONGODB_URI=mongodb://localhost/evensemble
# JWT_SECRET=your_jwt_secret
# SERPAPI_KEY=your_serpapi_key
# PORT=5000

# Démarrer le serveur
npm start
```

### Frontend Setup

```bash
# Accéder au dossier frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
ng serve

# L'app sera accessible sur http://localhost:4200
```
---

## 📝 Licence

Ce projet est un travail académique réalisé en 2026.

---