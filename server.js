require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

// Get lat/lon from city name (OpenWeatherMap)
app.get('/api/latlon', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'Missing city parameter' });

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${process.env.apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch lat/lon' });
  }
});

// Get nearest fire (xWeather)
app.get('/api/fire', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Missing lat or lon' });

  const url = `https://data.api.xweather.com/fires/closest?p=${lat},${lon}&format=json&client_id=${process.env.clientId}&client_secret=${process.env.clientSecret}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch fire data' });
  }
});

// Get cell tower info (Unwired Labs)
app.get('/api/celltower', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Missing lat or lon' });

  const url = `https://us1.unwiredlabs.com/v2/reverse?token=${process.env.cellKey}&lat=${lat}&lon=${lon}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cell tower info' });
  }
});

app.use(express.static(path.join(__dirname, 'project', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'project', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
