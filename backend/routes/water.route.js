const express = require('express');
const { logWater } = require('../controllers/water.controller');
const { protect } = require('../middleware/authMiddleware'); // Ensure user is authenticated
const router = express.Router();

// Route to log water intake (protected by authentication)
router.post('/log', protect, logWater);

module.exports = router;
