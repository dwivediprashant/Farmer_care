const express = require('express');
const axios = require('axios');
const MarketCache = require('../models/MarketCache');

const router = express.Router();

const GOVT_API_BASE = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

// Get market prices
router.get('/', async (req, res) => {
  try {
    const { commodity, state, page = 1, limit = 12 } = req.query;
    
    // Build API parameters
    const params = {
      'api-key': API_KEY,
      format: 'json',
      limit: 1000
    };
    
    if (commodity) {
      params['filters[commodity]'] = commodity;
    }
    if (state) {
      params['filters[state.keyword]'] = state;
    }

    try {
      const response = await axios.get(GOVT_API_BASE, { params });
      
      if (response.data && response.data.records) {
        const formattedData = response.data.records.map(record => ({
          commodity: record.commodity || 'N/A',
          market: record.market || 'N/A',
          state: record.state || 'N/A',
          district: record.district || 'N/A',
          date: record.arrival_date || new Date().toISOString().split('T')[0],
          modalPrice: parseFloat(record.modal_price) || 0,
          minPrice: parseFloat(record.min_price) || 0,
          maxPrice: parseFloat(record.max_price) || 0,
          variety: record.variety || 'N/A',
          grade: record.grade || 'N/A',
          source: 'Government API'
        }));
        
        // Return paginated response
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedData = formattedData.slice(startIndex, endIndex);
        
        return res.json({
          articles: paginatedData,
          total: formattedData.length,
          page: parseInt(page),
          totalPages: Math.ceil(formattedData.length / limit)
        });
      }
    } catch (apiError) {
      console.error('Government API error:', apiError.message);
    }

    // Fallback to mock data if API fails
    const mockData = [
      {
        commodity: commodity || 'Rice',
        market: 'Sample Market',
        state: state || 'Delhi',
        date: new Date().toISOString().split('T')[0],
        modalPrice: 2500,
        minPrice: 2300,
        maxPrice: 2700,
        source: 'Mock Data'
      }
    ];
    
    // Return paginated mock data
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedMockData = mockData.slice(startIndex, endIndex);
    
    res.json({
      articles: paginatedMockData,
      total: mockData.length,
      page: parseInt(page),
      totalPages: Math.ceil(mockData.length / limit)
    });
  } catch (error) {
    console.error('Market API error:', error.message);
    res.status(500).json({ message: 'Failed to fetch market data' });
  }
});

// Get available commodities
router.get('/commodities', async (req, res) => {
  try {
    const commodities = [
      'Rice', 'Wheat', 'Onion', 'Potato', 'Tomato', 
      'Maize', 'Sugarcane', 'Cotton', 'Soybean', 'Groundnut'
    ];
    res.json(commodities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch commodities' });
  }
});

// Get available states
router.get('/states', async (req, res) => {
  try {
    const states = [
      'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat',
      'Rajasthan', 'Punjab', 'Haryana', 'Uttar Pradesh', 'West Bengal'
    ];
    res.json(states);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch states' });
  }
});

module.exports = router;