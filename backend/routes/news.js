const express = require('express');
const axios = require('axios');

const router = express.Router();

// In-memory cache for news data
let newsCache = {
  data: null,
  timestamp: 0
};

// Get latest news
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const now = Date.now();
    
    // Check cache (15 minutes for fresher content)
    if (newsCache.data && (now - newsCache.timestamp < 15 * 60 * 1000)) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedData = newsCache.data.slice(startIndex, endIndex);
      return res.json({
        articles: paginatedData,
        total: newsCache.data.length,
        page: parseInt(page),
        totalPages: Math.ceil(newsCache.data.length / limit)
      });
    }

    // Try multiple agriculture news sources
    let articles = [];
    
    try {
      // Try agriculture-specific search
      const agriResponse = await axios.get('https://news.knowivate.com/api/search', {
        params: {
          q: 'agriculture farming crops india',
          limit: 100
        }
      });
      
      if (agriResponse.data && agriResponse.data.articles) {
        articles = agriResponse.data.articles;
      }
    } catch (searchError) {
      console.log('Agriculture search failed, trying general API');
      
      try {
        // Fallback to general news API
        const response = await axios.get('https://news.knowivate.com/api/latest');
        
        if (response.data.articles) {
          articles = response.data.articles;
        } else if (Array.isArray(response.data)) {
          articles = response.data;
        }
      } catch (generalError) {
        console.log('General API also failed');
      }
    }
    
    // If no articles found, use mock agriculture news
    if (!articles || articles.length === 0) {
      articles = [
        {
          title: "Latest Agriculture Updates",
          description: "Stay updated with the latest developments in agriculture and farming.",
          url: "#",
          publishedAt: new Date().toISOString(),
          source: { name: "Agriculture Today" }
        },
        {
          title: "Sustainable Farming Practices",
          description: "Learn about eco-friendly farming methods that boost productivity.",
          url: "#",
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          source: { name: "Green Farming" }
        },
        {
          title: "Crop Price Analysis for 2024",
          description: "Market experts analyze crop price trends and predictions for the upcoming season.",
          url: "#",
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
          source: { name: "Market Analysis" }
        },
        {
          title: "Weather Impact on Agriculture",
          description: "How changing weather patterns are affecting crop yields across different regions.",
          url: "#",
          publishedAt: new Date(Date.now() - 259200000).toISOString(),
          source: { name: "Weather Agriculture" }
        },
        {
          title: "Government Schemes for Farmers",
          description: "New government initiatives to support farmers with subsidies and technology.",
          url: "#",
          publishedAt: new Date(Date.now() - 345600000).toISOString(),
          source: { name: "Government News" }
        },
        {
          title: "Smart Irrigation Systems Boost Water Efficiency",
          description: "Modern drip irrigation and smart water management systems help farmers save water.",
          url: "#",
          publishedAt: new Date(Date.now() - 432000000).toISOString(),
          source: { name: "Water Management" }
        },
        {
          title: "Fertilizer Prices Expected to Stabilize",
          description: "Market analysis shows fertilizer costs may stabilize in the coming months.",
          url: "#",
          publishedAt: new Date(Date.now() - 518400000).toISOString(),
          source: { name: "Market Watch" }
        },
        {
          title: "Pest Control Methods for Monsoon Season",
          description: "Effective pest management strategies to protect crops during rainy season.",
          url: "#",
          publishedAt: new Date(Date.now() - 604800000).toISOString(),
          source: { name: "Crop Protection" }
        },
        {
          title: "Export Opportunities for Indian Agriculture",
          description: "Growing international demand for Indian agricultural products opens new markets.",
          url: "#",
          publishedAt: new Date(Date.now() - 691200000).toISOString(),
          source: { name: "Export News" }
        },
        {
          title: "Soil Testing Camps Organized Across States",
          description: "Free soil testing facilities being set up to help farmers optimize crop nutrition.",
          url: "#",
          publishedAt: new Date(Date.now() - 777600000).toISOString(),
          source: { name: "Soil Health" }
        }
      ];
    }

    const newsData = articles.map(article => ({
      title: article.title || 'No Title',
      summary: article.description || article.summary || article.content || 'No summary available',
      url: article.url || '#',
      publishedAt: article.publishedAt || article.published_at || new Date().toISOString(),
      source: article.source?.name || article.source || 'News Source'
    }));

    // Cache the result
    newsCache = {
      data: newsData,
      timestamp: now
    };

    // Return paginated response
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedData = newsData.slice(startIndex, endIndex);
    
    res.json({
      articles: paginatedData,
      total: newsData.length,
      page: parseInt(page),
      totalPages: Math.ceil(newsData.length / limit)
    });
  } catch (error) {
    console.error('News API error:', error.message);
    
    // Return mock data on error
    const mockNews = [
      {
        title: "Government Announces New Crop Insurance Scheme",
        summary: "The government has launched a comprehensive crop insurance scheme to protect farmers from weather-related losses.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "Agriculture Ministry"
      },
      {
        title: "Organic Farming Techniques Show 30% Yield Increase",
        summary: "Recent studies demonstrate that modern organic farming methods can significantly boost crop yields while maintaining soil health.",
        url: "#",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: "Farm Research Institute"
      },
      {
        title: "Digital Agriculture Tools Gaining Popularity",
        summary: "Farmers across India are increasingly adopting digital tools for crop monitoring, weather forecasting, and market analysis.",
        url: "#",
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        source: "Tech Agriculture Today"
      }
    ];
    
    // Return paginated mock news
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedMockNews = mockNews.slice(startIndex, endIndex);
    
    res.json({
      articles: paginatedMockNews,
      total: mockNews.length,
      page: parseInt(page),
      totalPages: Math.ceil(mockNews.length / limit)
    });
  }
});

module.exports = router;