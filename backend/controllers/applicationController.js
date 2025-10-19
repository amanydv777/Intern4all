const Application = require('../models/Application');
const Internship = require('../models/Internship');

// @desc    Get all applications for a user
// @route   GET /api/applications
// @access  Private
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({
        path: 'internship',
        select: 'title company location stipend status',
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'internship',
        select: 'title company location stipend description requirements',
      })
      .populate({
        path: 'applicant',
        select: 'name email phone profile',
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Make sure user is application owner or admin
    if (
      application.applicant._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this application',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
exports.createApplication = async (req, res, next) => {
  try {
    const { internshipId, coverLetter, answers } = req.body;

    // Check if internship exists
    const internship = await Internship.findById(internshipId);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found',
      });
    }

    // Check if internship is active
    if (internship.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This internship is no longer accepting applications',
      });
    }

    // Check if application deadline has passed
    if (new Date() > new Date(internship.applicationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed',
      });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      internship: internshipId,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this internship',
      });
    }

    // Calculate AI match score (simplified version)
    const user = req.user;
    let matchScore = 0;

    if (user.profile.isComplete) {
      // Check skill match
      const matchingSkills = internship.skillsRequired.filter((skill) =>
        user.profile.skills.includes(skill)
      );
      matchScore += (matchingSkills.length / internship.skillsRequired.length) * 40;

      // Check sector match
      if (user.profile.sectors.includes(internship.sector)) {
        matchScore += 30;
      }

      // Check location match
      if (user.profile.preferredLocations.includes(internship.location)) {
        matchScore += 20;
      }

      // Base score for complete profile
      matchScore += 10;
    }

    // Create application
    const application = await Application.create({
      internship: internshipId,
      applicant: req.user.id,
      coverLetter,
      answers,
      aiMatchScore: Math.round(matchScore),
    });

    // Increment applications count
    await Internship.findByIdAndUpdate(internshipId, {
      $inc: { applicationsCount: 1 },
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Admin/Company)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    let application = await Application.findById(req.params.id).populate(
      'internship'
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Make sure user is internship owner or admin
    if (
      application.internship.postedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    application.status = status;
    application.notes = notes || application.notes;
    application.reviewedBy = req.user.id;
    application.reviewedAt = Date.now();

    await application.save();

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Make sure user is application owner
    if (application.applicant.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this application',
      });
    }

    await application.deleteOne();

    // Decrement applications count
    await Internship.findByIdAndUpdate(application.internship, {
      $inc: { applicationsCount: -1 },
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for an internship (Admin/Company)
// @route   GET /api/internships/:internshipId/applications
// @access  Private (Admin/Company)
exports.getInternshipApplications = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.internshipId);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found',
      });
    }

    // Make sure user is internship owner or admin
    if (
      internship.postedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view these applications',
      });
    }

    const applications = await Application.find({
      internship: req.params.internshipId,
    })
      .populate({
        path: 'applicant',
        select: 'name email phone profile',
      })
      .sort('-aiMatchScore -createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter only)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('internship');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user is the recruiter who posted the internship
    if (application.internship.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    application.status = req.body.status;
    application.reviewedBy = req.user.id;
    application.reviewedAt = Date.now();

    await application.save();

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application notes
// @route   PUT /api/applications/:id/notes
// @access  Private (Recruiter only)
exports.updateApplicationNotes = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('internship');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user is the recruiter who posted the internship
    if (application.internship.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    application.notes = req.body.notes;

    await application.save();

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update application status
// @route   PUT /api/applications/bulk/status
// @access  Private (Recruiter only)
exports.bulkUpdateStatus = async (req, res, next) => {
  try {
    const { applicationIds, status } = req.body;

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of application IDs',
      });
    }

    // Get all applications and verify ownership
    const applications = await Application.find({
      _id: { $in: applicationIds },
    }).populate('internship');

    // Verify all applications belong to internships posted by this recruiter
    const unauthorized = applications.some(
      (app) => app.internship.postedBy.toString() !== req.user.id && req.user.role !== 'admin'
    );

    if (unauthorized) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update one or more applications',
      });
    }

    // Update all applications
    await Application.updateMany(
      { _id: { $in: applicationIds } },
      {
        $set: {
          status,
          reviewedBy: req.user.id,
          reviewedAt: Date.now(),
        },
      }
    );

    res.status(200).json({
      success: true,
      message: `${applicationIds.length} applications updated successfully`,
    });
  } catch (error) {
    next(error);
  }
};
