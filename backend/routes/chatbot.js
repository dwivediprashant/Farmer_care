const express = require("express");
const axios = require("axios");
const router = express.Router();

// Chat with AI assistant
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are NeoKrishi AI, a helpful farming assistant. Provide concise, practical advice about agriculture, crops, weather, farming techniques, and market information. Keep responses under 150 words.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_CHATBOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      reply: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ message: "Failed to get AI response" });
  }
});

module.exports = router;
