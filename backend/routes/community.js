const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Update avatars for all users
router.post('/update-avatars', async (req, res) => {
  try {
    const result = await User.updateMany(
      {},
      { $set: { avatar: 'https://i.etsystatic.com/32486242/r/il/961434/5428907342/il_fullxfull.5428907342_rin0.jpg' } }
    );
    
    res.json({ 
      message: 'Avatars updated successfully',
      usersUpdated: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update avatars', error: error.message });
  }
});



// Cleanup old farmers collection and mock users
router.delete('/cleanup-all', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    
    // Drop farmers collection
    try {
      await mongoose.connection.db.collection('farmers').drop();
      console.log('Old farmers collection dropped');
    } catch (err) {
      console.log('No farmers collection to drop');
    }
    
    // Remove mock users (users with @farmer.com emails)
    const result = await User.deleteMany({ 
      email: { $regex: /@farmer\.com$/ }
    });
    console.log(`Removed ${result.deletedCount} mock users`);
    
    res.json({ 
      message: 'Cleanup completed',
      mockUsersRemoved: result.deletedCount
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ message: 'Cleanup failed', error: error.message });
  }
});



// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};



// Get all users except current user
router.get('/all', verifyToken, async (req, res) => {
  try {
    const users = await User.find({ 
      _id: { $ne: req.userId }
    })
    .populate('followers', 'name')
    .populate('following', 'name')
    .select('-passwordHash -pendingRequests -messages');
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get farmer by ID
router.get('/:id', async (req, res) => {
  try {
    const farmer = await User.findById(req.params.id)
      .populate('followers', 'name location')
      .populate('following', 'name location')
      .select('-passwordHash');
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    
    res.json(farmer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch farmer' });
  }
});

// Send follow request
router.post('/follow/:farmerId', verifyToken, async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    const farmer = await User.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Add current user to farmer's followers
    await User.findByIdAndUpdate(farmerId, {
      $addToSet: { followers: req.userId }
    });

    // Add farmer to current user's following
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { following: farmerId }
    });

    res.json({ message: 'Successfully followed farmer' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to follow farmer' });
  }
});

// Send message to user
router.post('/message/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { message } = req.body;
    
    await User.findByIdAndUpdate(userId, {
      $push: {
        messages: {
          from: req.userId,
          message: message,
          timestamp: new Date()
        }
      }
    });
    
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Get pending follow requests
router.get('/requests/:userId', verifyToken, async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.userId })
      .populate('pendingRequests', 'name location avatar crops');
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }
    
    res.json(farmer.pendingRequests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

// Accept follow request
router.post('/accept-follow', verifyToken, async (req, res) => {
  try {
    const { fromUserId } = req.body;
    
    // Get current user's farmer profile
    const toFarmer = await Farmer.findOne({ userId: req.userId });
    if (!toFarmer) {
      return res.status(404).json({ message: 'Your farmer profile not found' });
    }

    // Get requester farmer
    const fromFarmer = await Farmer.findById(fromUserId);
    if (!fromFarmer) {
      return res.status(404).json({ message: 'Requester farmer not found' });
    }

    // Remove from pending requests and add to followers/following
    await Farmer.findByIdAndUpdate(toFarmer._id, {
      $pull: { pendingRequests: fromUserId },
      $push: { followers: fromUserId }
    });

    await Farmer.findByIdAndUpdate(fromUserId, {
      $push: { following: toFarmer._id }
    });

    res.json({ message: 'Follow request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to accept follow request' });
  }
});

// Reject follow request
router.post('/reject-follow', verifyToken, async (req, res) => {
  try {
    const { fromUserId } = req.body;
    
    const toFarmer = await Farmer.findOne({ userId: req.userId });
    if (!toFarmer) {
      return res.status(404).json({ message: 'Your farmer profile not found' });
    }

    await Farmer.findByIdAndUpdate(toFarmer._id, {
      $pull: { pendingRequests: fromUserId }
    });

    res.json({ message: 'Follow request rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject follow request' });
  }
});

module.exports = router;