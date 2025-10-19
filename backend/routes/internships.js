const express = require('express');
const {
  getInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship,
  getRecommendations,
  getMyPostings,
  getRecruiterStats,
} = require('../controllers/internshipController');
const { getInternshipApplications } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const { internshipValidation, validate } = require('../middleware/validator');

const router = express.Router();

// Public routes
router.route('/').get(getInternships);
router.route('/:id').get(getInternship);

// Protected routes - Create internship (recruiters and admins)
router.route('/').post(
  protect,
  authorize('admin', 'recruiter'),
  internshipValidation,
  validate,
  createInternship
);

router
  .route('/:id')
  .put(protect, authorize('admin', 'recruiter'), updateInternship)
  .delete(protect, authorize('admin', 'recruiter'), deleteInternship);

// AI recommendations for interns
router.route('/recommendations/me').get(protect, getRecommendations);

// Recruiter-specific routes
router.route('/my-postings/all').get(protect, authorize('recruiter', 'admin'), getMyPostings);
router.route('/recruiter-stats/dashboard').get(protect, authorize('recruiter', 'admin'), getRecruiterStats);

// Applications for specific internship
router.route('/:internshipId/applications').get(
  protect,
  authorize('admin', 'recruiter'),
  getInternshipApplications
);

module.exports = router;
