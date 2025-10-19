const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['applied', 'under_review', 'interview', 'offer', 'rejected', 'shortlisted'],
      default: 'applied',
    },
    coverLetter: {
      type: String,
      maxlength: [1000, 'Cover letter cannot be more than 1000 characters'],
    },
    resume: {
      type: String,
      default: '',
    },
    answers: [
      {
        question: String,
        answer: String,
      },
    ],
    aiMatchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate applications
ApplicationSchema.index({ internship: 1, applicant: 1 }, { unique: true });

// Index for efficient queries
ApplicationSchema.index({ applicant: 1, status: 1 });
ApplicationSchema.index({ internship: 1, status: 1 });

module.exports = mongoose.model('Application', ApplicationSchema);
