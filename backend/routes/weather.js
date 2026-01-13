const express = require('express');
const axios = require('axios');

const router = express.Router();

// In-memory cache for weather data
let weatherCache = {};

// Get weather data
router.get('/', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const cacheKey = `${lat},${lon}`;
    const now = Date.now();
    
    // Check cache (5 minutes)
    if (weatherCache[cacheKey] && (now - weatherCache[cacheKey].timestamp < 5 * 60 * 1000)) {
      return res.json(weatherCache[cacheKey].data);
    }

    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_KEY}&units=metric`),
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_KEY}&units=metric`)
    ]);

    // Process 5-day forecast (get daily data)
    const dailyForecast = [];
    const processedDates = new Set();
    
    forecastResponse.data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!processedDates.has(date) && dailyForecast.length < 5) {
        dailyForecast.push({
          date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          temperature: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon
        });
        processedDates.add(date);
      }
    });

    const weatherData = {
      location: currentResponse.data.name,
      country: currentResponse.data.sys.country,
      temperature: Math.round(currentResponse.data.main.temp),
      description: currentResponse.data.weather[0].description,
      humidity: currentResponse.data.main.humidity,
      windSpeed: currentResponse.data.wind.speed,
      icon: currentResponse.data.weather[0].icon,
      forecast: dailyForecast
    };

    // Cache the result
    weatherCache[cacheKey] = {
      data: weatherData,
      timestamp: now
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

module.exports = router;