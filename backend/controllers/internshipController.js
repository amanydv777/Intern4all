const Internship = require('../models/Internship');
const User = require('../models/User');

// @desc    Get all internships
// @route   GET /api/internships
// @access  Public
exports.getInternships = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'minStipend', 'maxStipend', 'locationType', 'duration', 'skills'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    query = Internship.find(JSON.parse(queryStr));

    // Search functionality
    if (req.query.search) {
      query = query.find({
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { company: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
        ],
      });
    }

    // Filter by stipend range
    if (req.query.minStipend || req.query.maxStipend) {
      const stipendFilter = {};
      if (req.query.minStipend) {
        // Extract number from stipend string (e.g., "₹ 10,000/month" -> 10000)
        stipendFilter.$gte = parseInt(req.query.minStipend);
      }
      if (req.query.maxStipend) {
        stipendFilter.$lte = parseInt(req.query.maxStipend);
      }
      // This is a simplified filter - you may need to adjust based on your stipend format
    }

    // Filter by location type
    if (req.query.locationType) {
      const locationTypes = req.query.locationType.split(',');
      query = query.find({ locationType: { $in: locationTypes } });
    }

    // Filter by duration
    if (req.query.duration) {
      query = query.find({ duration: req.query.duration });
    }

    // Filter by skills
    if (req.query.skills) {
      const skills = req.query.skills.split(',');
      query = query.find({ skillsRequired: { $in: skills } });
    }

    // Filter by status (default to active)
    if (!reqQuery.status) {
      query = query.find({ status: 'active' });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Internship.countDocuments(query.getFilter());

    query = query.skip(startIndex).limit(limit);

    // Populate postedBy
    query = query.populate({
      path: 'postedBy',
      select: 'name email',
    });

    // Executing query
    const internships = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: internships.length,
      total,
      pagination,
      data: internships,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single internship
// @route   GET /api/internships/:id
// @access  Public
exports.getInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id).populate({
      path: 'postedBy',
      select: 'name email',
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found',
      });
    }

    res.status(200).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new internship
// @route   POST /api/internships
// @access  Private (Admin/Company)
exports.createInternship = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.postedBy = req.user.id;

    const internship = await Internship.create(req.body);

    res.status(201).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private (Admin/Company)
exports.updateInternship = async (req, res, next) => {
  try {
    let internship = await Internship.findById(req.params.id);

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
        message: 'Not authorized to update this internship',
      });
    }

    internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private (Admin/Company)
exports.deleteInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);

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
        message: 'Not authorized to delete this internship',
      });
    }

    await internship.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI-recommended internships for user
// @route   GET /api/internships/recommendations
// @access  Private
exports.getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.profile.isComplete) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile to get recommendations',
      });
    }

    // Build query based on user profile
    const query = {
      status: 'active',
      $or: [
        { sector: { $in: user.profile.sectors } },
        { skillsRequired: { $in: user.profile.skills } },
        { location: { $in: user.profile.preferredLocations } },
      ],
    };

    const internships = await Internship.find(query)
      .sort('-createdAt')
      .limit(10)
      .populate({
        path: 'postedBy',
        select: 'name email',
      });

    res.status(200).json({
      success: true,
      count: internships.length,
      data: internships,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get internships posted by current recruiter
// @route   GET /api/internships/my-postings
// @access  Private (Recruiter only)
exports.getMyPostings = async (req, res, next) => {
  try {
    const internships = await Internship.find({ postedBy: req.user.id })
      .sort('-createdAt')
      .populate({
        path: 'postedBy',
        select: 'name email',
      });

    res.status(200).json({
      success: true,
      count: internships.length,
      data: internships,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get statistics for recruiter dashboard
// @route   GET /api/internships/recruiter-stats
// @access  Private (Recruiter only)
exports.getRecruiterStats = async (req, res, next) => {
  try {
    const Application = require('../models/Application');
    
    // Get all internships posted by recruiter
    const internships = await Internship.find({ postedBy: req.user.id });
    const internshipIds = internships.map(i => i._id);
    
    // Get all applications for these internships
    const applications = await Application.find({ 
      internship: { $in: internshipIds } 
    });
    
    // Calculate statistics
    const stats = {
      totalPostings: internships.length,
      activePostings: internships.filter(i => i.status === 'active').length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(a => a.status === 'pending').length,
      acceptedApplications: applications.filter(a => a.status === 'accepted').length,
      rejectedApplications: applications.filter(a => a.status === 'rejected').length,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
