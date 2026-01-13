const express = require('express');
const axios = require('axios');

const router = express.Router();

// Get agriculture scheme videos from YouTube
router.get('/schemes', async (req, res) => {
  try {
    const { page = 1, limit = 6 } = req.query;
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const searchQueries = [
      'PM KISAN agriculture scheme farmers India',
      'government agriculture schemes farmers benefits India',
      'farming schemes crop insurance soil health card India'
    ];

    const videos = [];

    for (const query of searchQueries) {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            key: YOUTUBE_API_KEY,
            q: query,
            part: 'snippet',
            type: 'video',
            maxResults: 12,
            order: 'relevance',
            regionCode: 'IN',
            relevanceLanguage: 'en'
          }
        });

        if (response.data.items && response.data.items.length > 0) {
          response.data.items.forEach(video => {
            videos.push({
              id: video.id.videoId,
              title: video.snippet.title,
              description: video.snippet.description,
              thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
              channelTitle: video.snippet.channelTitle,
              publishedAt: video.snippet.publishedAt
            });
          });
        }
      } catch (error) {
        console.error(`Error fetching video for query "${query}":`, error.message);
      }
    }

    // If no videos found, return empty result
    if (videos.length === 0) {
      return res.json({
        videos: [],
        total: 0,
        page: parseInt(page),
        totalPages: 0,
        hasMore: false
      });
    }

    // Return paginated response
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedVideos = videos.slice(startIndex, endIndex);
    
    // If no videos on this page, return empty result
    if (paginatedVideos.length === 0 && page > 1) {
      return res.json({
        videos: [],
        total: videos.length,
        page: parseInt(page),
        totalPages: Math.ceil(videos.length / limit),
        hasMore: false
      });
    }
    
    res.json({
      videos: paginatedVideos,
      total: videos.length,
      page: parseInt(page),
      totalPages: Math.ceil(videos.length / limit),
      hasMore: endIndex < videos.length
    });
  } catch (error) {
    console.error('YouTube API error:', error.message);
    res.status(500).json({ message: 'Failed to fetch scheme videos' });
  }
});

module.exports = router;