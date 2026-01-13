const express = require('express');
const axios = require('axios');
const CropRecoHistory = require('../models/CropRecoHistory');

const router = express.Router();



// Advanced crop recommendation using AI
router.post('/advanced', async (req, res) => {
  try {
    const { soilType, lastCrop, yearsUsed, season, nitrogen, phosphorus, potassium, ph, moisture, location } = req.body;
    
    // Build AI prompt with all available data
    let prompt = `As an expert agronomist, recommend the best crops based on:

Soil Analysis:
- Soil Type: ${soilType}
- Last Crop: ${lastCrop} (grown for ${yearsUsed} years)
- Season: ${season}`;
    
    if (nitrogen || phosphorus || potassium) {
      prompt += `\n- NPK Values: N=${nitrogen || 'unknown'}, P=${phosphorus || 'unknown'}, K=${potassium || 'unknown'} mg/kg`;
    }
    
    if (ph) {
      prompt += `\n- pH Level: ${ph}`;
    }
    
    if (moisture) {
      prompt += `\n- Soil Moisture: ${moisture}%`;
    }
    
    if (location) {
      prompt += `\n- Location: ${location}`;
    }
    
    prompt += `\n\nProvide:
1. Top 3 recommended crops with reasons
2. Profitability score (1-10)
3. Climate suitability
4. Soil match score
5. Specific farming tips

Format as JSON with: {"crops": [{"name": "", "profitability": 0, "suitability": "", "soilMatch": 0, "tips": []}]}`;
    
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert agricultural scientist. Provide precise, practical crop recommendations based on soil and environmental data.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_CHATBOT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const aiResponse = response.data.choices[0].message.content;
    
    // Extract JSON from AI response (handle markdown code blocks)
    let recommendation;
    try {
      // Try to extract JSON from markdown code block
      let jsonStr = aiResponse;
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      
      recommendation = JSON.parse(jsonStr);
    } catch {
      // Fallback format if AI doesn't return valid JSON
      recommendation = {
        mode: 'advanced',
        aiResponse: aiResponse,
        inputData: { soilType, lastCrop, yearsUsed, season, nitrogen, phosphorus, potassium, ph, moisture, location }
      };
    }
    
    res.json(recommendation);
  } catch (error) {
    console.error('Advanced recommendation error:', error);
    res.status(500).json({ message: 'Failed to get AI recommendation' });
  }
});



// Get soil types
router.get('/soil-types', (req, res) => {
  const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Silt', 'Peaty', 'Chalky'];
  res.json(soilTypes);
});

// Get common crops
router.get('/crops', (req, res) => {
  const crops = [
    'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Groundnut',
    'Soybean', 'Millet', 'Barley', 'Vegetables', 'Pulses'
  ];
  res.json(crops);
});

// Get seasons
router.get('/seasons', (req, res) => {
  const seasons = ['Kharif', 'Rabi', 'Zaid'];
  res.json(seasons);
});

module.exports = router;