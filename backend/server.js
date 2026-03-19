require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/hotels", require("./routes/hotels"));
app.use("/api/events", require("./routes/events"));
app.use("/api/geocode", require("./routes/geocode"));
app.use("/api/transport", require("./routes/transport"));
app.use('/api/favorites', require('./routes/favoris'));

app.listen(PORT, () => {
  console.log(`Serveur démarre sur la porte http://localhost:${PORT}`);
});
