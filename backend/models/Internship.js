const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an internship title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      type: String,
      required: [true, 'Please provide a location'],
      trim: true,
    },
    locationType: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      default: 'On-site',
    },
    stipend: {
      type: String,
      required: [true, 'Please provide stipend information'],
    },
    duration: {
      type: String,
      required: [true, 'Please provide duration'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Please provide an application deadline'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    sector: {
      type: String,
      required: [true, 'Please provide a sector'],
      trim: true,
    },
    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],
    numberOfOpenings: {
      type: Number,
      default: 1,
      min: [1, 'Number of openings must be at least 1'],
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search optimization
InternshipSchema.index({ title: 'text', company: 'text', description: 'text' });
InternshipSchema.index({ sector: 1, location: 1, status: 1 });

module.exports = mongoose.model('Internship', InternshipSchema);
