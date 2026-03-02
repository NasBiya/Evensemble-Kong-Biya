require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/search', require('./routes/hotels'));
app.use('/search', require('./routes/events'));
app.use('/search', require('./routes/transport'));
app.listen(PORT, () => {
    console.log(`Serveur démarre sur la porte http://localhost:${PORT}`);
});
