const express = require('express');
const { uploadResume, getResume } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/resume', protect, uploadResume);
router.get('/resume/:userId', protect, getResume);

module.exports = router;
