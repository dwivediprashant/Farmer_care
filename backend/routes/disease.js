const express = require('express');
const multer = require('multer');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});



// Advanced disease detection using Google Gemini Vision
router.post('/analyze-advanced', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Convert image to base64
    const base64Image = req.file.buffer.toString('base64');
    
    const axios = require('axios');
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_GEMINI_VISION_API_KEY}`,
      {
        contents: [{
          parts: [
            {
              text: `Analyze this plant image for diseases. Provide response in JSON format with:
{
  "disease": "disease name or 'Healthy Plant'",
  "confidence": confidence_percentage,
  "severity": "Low/Medium/High/None",
  "treatment": "specific treatment steps",
  "prevention": "prevention measures",
  "pesticides": ["recommended pesticides"],
  "organicCures": ["organic treatment options"],
  "sprayTiming": "when to apply treatment",
  "fertilizers": ["recommended fertilizers"]
}`
            },
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: base64Image
              }
            }
          ]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    
    // Extract JSON from AI response
    let result;
    try {
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || aiResponse.match(/{[\s\S]*}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        result = JSON.parse(aiResponse);
      }
    } catch {
      // Fallback if JSON parsing fails
      result = {
        disease: 'Analysis Complete',
        confidence: 75,
        severity: 'Unknown',
        treatment: aiResponse,
        prevention: 'Follow general plant care guidelines',
        pesticides: ['Consult local agricultural expert'],
        organicCures: ['Neem oil', 'Baking soda solution'],
        sprayTiming: 'Early morning or evening',
        fertilizers: ['Balanced NPK fertilizer']
      };
    }
    
    res.json({
      ...result,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      scanDate: new Date().toISOString(),
      scanId: Math.random().toString(36).substr(2, 9),
      mode: 'advanced'
    });
  } catch (error) {
    console.error('Advanced disease analysis error:', error);
    res.status(500).json({ message: 'Failed to analyze image with AI' });
  }
});





module.exports = router;