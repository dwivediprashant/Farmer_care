const mongoose = require('mongoose');

const marketCacheSchema = new mongoose.Schema({
  commodity: {
    type: String,
    required: true
  },
  market: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  modalPrice: {
    type: Number,
    required: true
  },
  minPrice: {
    type: Number,
    required: true
  },
  maxPrice: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    default: 'AGMARKNET'
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  }
});

marketCacheSchema.index({ commodity: 1, market: 1, date: -1 });

module.exports = mongoose.model('MarketCache', marketCacheSchema);