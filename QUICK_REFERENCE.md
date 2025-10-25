# Quick Reference Guide - Intern4All

## 🚀 Quick Start Commands

### Development Setup
```bash
# Clone repository
git clone <repo-url>
cd Intern4all

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
npm install

# Start backend (from backend folder)
cd backend
npm run dev

# Start frontend (from root folder)
npm start
```

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/intern4all
JWT_SECRET=your_secret_key_min_32_chars
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints Quick Reference

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/auth/logout` | Logout user | Yes |
| POST | `/api/auth/forgotpassword` | Forgot password (security key) | No |
| PUT | `/api/auth/resetpassword/:token` | Reset password | No |
| PUT | `/api/auth/updatedetails` | Update user details | Yes |
| PUT | `/api/auth/updatepassword` | Update password | Yes |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |
| POST | `/api/upload/resume` | Upload resume | Yes |

### Internships
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/internships` | Get all internships | No |
| GET | `/api/internships/:id` | Get single internship | No |
| POST | `/api/internships` | Create internship | Yes (Recruiter/Admin) |
| PUT | `/api/internships/:id` | Update internship | Yes (Owner/Admin) |
| DELETE | `/api/internships/:id` | Delete internship | Yes (Owner/Admin) |
| GET | `/api/internships/recommendations/me` | Get AI recommendations | Yes |

### Applications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/applications` | Get my applications | Yes |
| GET | `/api/applications/:id` | Get single application | Yes |
| POST | `/api/applications` | Submit application | Yes (Intern) |
| DELETE | `/api/applications/:id` | Delete application | Yes (Owner) |
| PUT | `/api/applications/:id/status` | Update status | Yes (Recruiter/Admin) |
| PUT | `/api/applications/:id/notes` | Update notes | Yes (Recruiter/Admin) |
| PUT | `/api/applications/bulk/status` | Bulk update status | Yes (Recruiter/Admin) |

---

## 🔐 Authentication Flow

### Register
```javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "intern",
  "securityKey": "mySecretKey123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

### Login
```javascript
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

### Forgot Password
```javascript
POST /api/auth/forgotpassword
{
  "email": "john@example.com",
  "securityKey": "mySecretKey123"
}

Response:
{
  "success": true,
  "message": "Security key verified",
  "resetToken": "reset_token_here"
}
```

### Reset Password
```javascript
PUT /api/auth/resetpassword/:resetToken
{
  "password": "newPassword123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

---

## 📝 Data Models

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  securityKey: String (hashed, required),
  phone: String,
  location: String,
  avatar: String,
  role: 'intern' | 'recruiter' | 'admin',
  profile: {
    education: String,
    studyField: String,
    university: String,
    githubLink: String,
    linkedinLink: String,
    resumePath: String,
    skills: [String],
    sectors: [String],
    preferredLocations: [String],
    availability: String,
    isComplete: Boolean
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Internship Schema
```javascript
{
  title: String (required),
  company: String (required),
  description: String (required),
  requirements: [String],
  responsibilities: [String],
  skillsRequired: [String],
  location: String (required),
  locationType: 'remote' | 'onsite' | 'hybrid',
  stipend: String (required),
  duration: String (required),
  startDate: Date (required),
  applicationDeadline: Date (required),
  numberOfOpenings: Number,
  sector: String,
  status: 'active' | 'closed' | 'draft',
  postedBy: ObjectId (User),
  applicationsCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Application Schema
```javascript
{
  internship: ObjectId (Internship, required),
  applicant: ObjectId (User, required),
  status: 'applied' | 'under_review' | 'interview' | 'offer' | 'rejected' | 'shortlisted',
  coverLetter: String (max 1000 chars),
  resume: String,
  answers: [{
    question: String,
    answer: String
  }],
  aiMatchScore: Number (0-100),
  notes: String,
  reviewedBy: ObjectId (User),
  reviewedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Frontend Components

### Main Components
- `App.js` - Main application container
- `LoginPage.js` - Login page
- `SignUpPage` - Registration page
- `ForgotPasswordPage` - Password recovery
- `ResetPasswordPage` - Password reset
- `SkillSyncApp` - Main dashboard
- `DashboardPage` - Dashboard view
- `FindInternshipsPage` - Browse internships
- `MyApplicationsPage` - View applications
- `ProfilePage` - User profile
- `InternshipDetailPage` - Internship details
- `AIAssistantModal` - AI chatbot

### Services
- `authService.js` - Authentication API calls
- `userService.js` - User profile API calls
- `internshipService.js` - Internship API calls
- `applicationService.js` - Application API calls
- `api.js` - Axios instance with interceptors

---

## 🔧 Common Tasks

### Add New API Endpoint

1. **Create Controller** (`backend/controllers/`)
```javascript
exports.myNewFunction = async (req, res, next) => {
  try {
    // Your logic here
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
```

2. **Add Route** (`backend/routes/`)
```javascript
router.get('/my-endpoint', protect, myNewFunction);
```

3. **Add Service** (`src/services/`)
```javascript
export const myNewService = async () => {
  const response = await api.get('/my-endpoint');
  return response.data;
};
```

### Add New Page

1. **Create Component** in `src/App.js`
```javascript
const MyNewPage = () => {
  return (
    <div className="dashboard">
      <h1>My New Page</h1>
    </div>
  );
};
```

2. **Add Navigation**
```javascript
const navItems = [
  // ... existing items
  { name: 'My Page', icon: LuIcon, page: 'MyPage' }
];
```

3. **Add Route in Main Component**
```javascript
{activePage === 'MyPage' && <MyNewPage />}
```

---

## 🐛 Debugging Tips

### Backend Debugging
```javascript
// Add console logs
console.log('Debug:', variable);

// Use morgan for request logging (already configured)
// Check terminal for request logs

// MongoDB queries
const result = await Model.find().explain('executionStats');
console.log(result);
```

### Frontend Debugging
```javascript
// React DevTools
// Check component state and props

// Network tab
// Monitor API calls

// Console logs
console.log('State:', state);
console.log('Props:', props);
```

### Common Issues

**Issue: CORS Error**
```
Solution: Check FRONTEND_URL in backend .env
Verify CORS configuration in server.js
```

**Issue: MongoDB Connection Failed**
```
Solution: Check MONGODB_URI
Ensure MongoDB is running
Check network connectivity
```

**Issue: JWT Token Invalid**
```
Solution: Check JWT_SECRET matches
Verify token is being sent in headers
Check token expiration
```

---

## 📊 Database Commands

### MongoDB Shell
```bash
# Connect to database
mongosh "mongodb://localhost:27017/intern4all"

# View collections
show collections

# View users
db.users.find().pretty()

# View internships
db.internships.find().pretty()

# View applications
db.applications.find().pretty()

# Delete all data
db.users.deleteMany({})
db.internships.deleteMany({})
db.applications.deleteMany({})
```

### Seeder Commands
```bash
# Import data
node seeder.js -i

# Delete data
node seeder.js -d
```

---

## 🔍 Useful Code Snippets

### Protected Route Middleware
```javascript
const { protect, authorize } = require('../middleware/auth');

// Protect route (any authenticated user)
router.get('/protected', protect, controller);

// Authorize specific roles
router.post('/admin-only', protect, authorize('admin'), controller);
```

### Error Handling
```javascript
try {
  // Your code
} catch (error) {
  next(error); // Pass to error handler middleware
}
```

### Pagination
```javascript
const page = parseInt(req.query.page, 10) || 1;
const limit = parseInt(req.query.limit, 10) || 10;
const startIndex = (page - 1) * limit;

const results = await Model.find()
  .limit(limit)
  .skip(startIndex);
```

### Search & Filter
```javascript
let query = {};

if (req.query.search) {
  query.title = { $regex: req.query.search, $options: 'i' };
}

if (req.query.location) {
  query.location = req.query.location;
}

const results = await Model.find(query);
```

---

## 🚨 Emergency Procedures

### Server Down
1. Check server logs
2. Verify environment variables
3. Check database connection
4. Restart server
5. Check for recent code changes

### Database Issues
1. Check MongoDB Atlas status
2. Verify connection string
3. Check IP whitelist
4. Review recent queries
5. Check disk space

### High Error Rate
1. Check error logs
2. Identify error pattern
3. Check recent deployments
4. Rollback if necessary
5. Fix and redeploy

---

## 📞 Support Contacts

- **Documentation**: Check README.md and guides
- **Issues**: Create GitHub issue
- **Questions**: Check TESTING_GUIDE.md
- **Deployment**: See DEPLOYMENT_GUIDE.md

---

## 🔗 Useful Links

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)

---

**Last Updated:** December 2024  
**Version:** 2.0.0
