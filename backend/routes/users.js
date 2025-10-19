const express = require('express');
const {
  getProfile,
  updateProfile,
  getUsers,
  getUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// User profile routes
router.route('/profile').get(protect, getProfile).put(protect, updateProfile);

// Admin routes
router.route('/').get(protect, authorize('admin'), getUsers);
router
  .route('/:id')
  .get(protect, authorize('admin'), getUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
