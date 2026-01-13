const mongoose = require('mongoose');

const cropRecoHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous recommendations
  },
  soilType: {
    type: String,
    required: true,
    enum: ['Clay', 'Sandy', 'Loamy', 'Silt', 'Peaty', 'Chalky']
  },
  lastCrop: {
    type: String,
    required: true
  },
  yearsUsed: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  season: {
    type: String,
    enum: ['Kharif', 'Rabi', 'Zaid'],
    default: 'Kharif'
  },
  recommendedCrop: {
    type: String,
    required: true
  },
  notes: [{
    type: String
  }],
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 75
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CropRecoHistory', cropRecoHistorySchema);