const fs = require('fs');
const path = require('path');
const User = require('../models/User');

// @desc    Upload resume
// @route   POST /api/upload/resume
// @access  Private
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const file = req.files.resume;

    // Check file type
    if (!file.mimetype.includes('pdf')) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file',
      });
    }

    // Check file size (300KB = 307200 bytes)
    if (file.size > 307200) {
      return res.status(400).json({
        success: false,
        message: 'File size should not exceed 300KB',
      });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../uploads/resumes');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const fileName = `resume_${req.user.id}_${Date.now()}${path.extname(file.name)}`;
    const filePath = path.join(uploadsDir, fileName);

    // Move file to uploads directory
    file.mv(filePath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: 'Problem with file upload',
        });
      }

      // Update user profile with resume path
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { 'profile.resumePath': `/uploads/resumes/${fileName}` },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        data: {
          fileName,
          filePath: `/uploads/resumes/${fileName}`,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get resume
// @route   GET /api/upload/resume/:userId
// @access  Private
exports.getResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user || !user.profile.resumePath) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    const filePath = path.join(__dirname, '..', user.profile.resumePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Resume file not found',
      });
    }

    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};
