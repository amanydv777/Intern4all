const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  validate,
} = require('../middleware/validator');

const router = express.Router();

// Local authentication routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, profileUpdateValidation, validate, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/logout', protect, logout);

// Password reset routes
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;
