const express = require('express');
const {
  getMyApplications,
  getApplication,
  createApplication,
  updateApplicationStatus,
  updateApplicationNotes,
  bulkUpdateStatus,
  deleteApplication,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const { applicationValidation, validate } = require('../middleware/validator');

const router = express.Router();

// All routes are protected
router.use(protect);

router
  .route('/')
  .get(getMyApplications)
  .post(applicationValidation, validate, createApplication);

// Bulk operations
router
  .route('/bulk/status')
  .put(authorize('admin', 'recruiter'), bulkUpdateStatus);

router
  .route('/:id')
  .get(getApplication)
  .delete(deleteApplication);

router
  .route('/:id/status')
  .put(authorize('admin', 'recruiter'), updateApplicationStatus);

router
  .route('/:id/notes')
  .put(authorize('admin', 'recruiter'), updateApplicationNotes);

module.exports = router;
