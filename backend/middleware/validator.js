const { body, validationResult } = require('express-validator');

// Validation middleware
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Log validation errors for debugging
    console.log('Validation errors:', errors.array());
    
    // Format error message
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    
    return res.status(400).json({
      success: false,
      message: errorMessages,
      errors: errors.array(),
    });
  }
  next();
};

// Registration validation rules
exports.registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Login validation rules
exports.loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Profile update validation rules
exports.profileUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('phone').optional().trim(),
  body('location').optional().trim(),
];

// Internship creation validation rules
exports.internshipValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('stipend').trim().notEmpty().withMessage('Stipend information is required'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('applicationDeadline')
    .isISO8601()
    .withMessage('Valid application deadline is required'),
  body('sector').trim().notEmpty().withMessage('Sector is required'),
];

// Application validation rules
exports.applicationValidation = [
  body('internshipId').notEmpty().withMessage('Internship ID is required'),
  body('coverLetter')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Cover letter cannot exceed 1000 characters'),
];
