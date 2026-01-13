const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/farmer-assistant')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/news', require('./routes/news'));
app.use('/api/market', require('./routes/market'));
app.use('/api/crop-reco', require('./routes/crop-reco'));
app.use('/api/disease', require('./routes/disease'));
app.use('/api/youtube', require('./routes/youtube'));
app.use('/api/community', require('./routes/community'));
app.use('/api/chatbot', require('./routes/chatbot'));

// Profile route
app.get('/api/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId)
      .populate('messages.from', 'name email')
      .select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      email: user.email,
      joinDate: user.createdAt,
      followers: user.followers || [],
      following: user.following || [],
      messages: user.messages || []
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Farmer Assistant API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});