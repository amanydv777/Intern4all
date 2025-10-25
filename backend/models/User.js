const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['intern', 'recruiter', 'admin'],
      default: 'intern',
    },
    profile: {
      education: {
        type: String,
        enum: ['High School', 'Undergraduate', 'Graduate', 'Postgraduate', ''],
        default: '',
      },
      studyField: {
        type: String,
        default: '',
      },
      university: {
        type: String,
        default: '',
      },
      githubLink: {
        type: String,
        default: '',
      },
      linkedinLink: {
        type: String,
        default: '',
      },
      resumePath: {
        type: String,
        default: '',
      },
      skills: [
        {
          type: String,
          trim: true,
        },
      ],
      sectors: [
        {
          type: String,
          trim: true,
        },
      ],
      preferredLocations: [
        {
          type: String,
          trim: true,
        },
      ],
      availability: {
        type: String,
        enum: ['Immediately', 'In 1 month', 'In 2 months', 'In 3+ months', ''],
        default: '',
      },
      isComplete: {
        type: Boolean,
        default: false,
      },
    },
    securityKey: {
      type: String,
      required: [true, 'Please provide a security key'],
      minlength: [4, 'Security key must be at least 4 characters'],
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password and security key before saving
UserSchema.pre('save', async function (next) {
  // Hash password if modified
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Hash security key if modified
  if (this.isModified('securityKey') && this.securityKey) {
    const salt = await bcrypt.genSalt(10);
    this.securityKey = await bcrypt.hash(this.securityKey, salt);
  }
  
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Match user entered security key to hashed security key in database
UserSchema.methods.matchSecurityKey = async function (enteredSecurityKey) {
  return await bcrypt.compare(enteredSecurityKey, this.securityKey);
};

module.exports = mongoose.model('User', UserSchema);
