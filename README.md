# Intern4All - AI-Powered Internship Platform

A complete MERN stack application for connecting students with internship opportunities, featuring AI-powered matching, multi-language support, and intelligent recommendations.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Features

### Frontend (React)
- **Modern UI/UX** - Clean, responsive design with mobile support
- **Multi-language Support** - English, Hindi, Bengali, Telugu, Marathi, Gujarati, Kannada
- **AI Assistant** - Integrated Google Gemini AI chatbot for user support
- **User Dashboard** - Track applications, view recommendations, monitor progress
- **Profile Management** - Complete profile with skills, preferences, and education
- **Real-time Updates** - Live application status tracking

### Backend (Node.js + Express + MongoDB)
- **Secure Authentication** - JWT-based auth + Google OAuth 2.0
- **Role-Based Access** - User, Company, and Admin roles
- **AI-Powered Matching** - Smart internship recommendations based on user profile
- **RESTful API** - Well-documented, scalable API architecture
- **Data Security** - Helmet, rate limiting, input sanitization
- **Database Seeding** - Sample data for quick testing

## 🛠️ Tech Stack

### Frontend
- React 19.1.1
- React Icons
- Axios
- Google Generative AI (Gemini)

### Backend
- Node.js
- Express.js 4.18.2
- MongoDB with Mongoose 8.0.0
- JWT Authentication
- Passport.js (Google OAuth)
- Bcrypt for password hashing

### Security & Middleware
- Helmet.js
- CORS
- Express Rate Limit
- Express Validator
- Express Mongo Sanitize

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - OR use MongoDB Atlas (cloud database)
- **Git** - [Download](https://git-scm.com/)
- **npm** or **yarn** package manager

## 🚀 Quick Start Installation

### Option 1: Automated Setup (Recommended)

Run the setup script to automatically install and configure everything:

```bash
# Make the script executable (Mac/Linux)
chmod +x setup.sh

# Run the setup script
./setup.sh
```

### Option 2: Manual Installation

Follow these steps to set up the project manually:

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Intern4all
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your configuration
# Update the following values:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (generate a secure random string)
# - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (if using Google OAuth)
# - GEMINI_API_KEY (for AI features)

# Generate a secure JWT secret (optional)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Seed the database with sample data
node seeder.js -i

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

#### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to project root (if in backend folder)
cd ..

# Install dependencies
npm install

# The .env file should already exist with:
# REACT_APP_API_URL=http://localhost:5000/api
# REACT_APP_GEMINI_API_KEY=your_gemini_api_key

# Start the frontend development server
npm start
```

The frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
Intern4all/
├── backend/                    # Backend Node.js application
│   ├── config/                # Configuration files
│   │   ├── db.js             # Database connection
│   │   └── passport.js       # Passport authentication config
│   ├── controllers/          # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── internshipController.js
│   │   └── applicationController.js
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js          # Authentication middleware
│   │   ├── errorHandler.js  # Error handling
│   │   └── validator.js     # Input validation
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   ├── Internship.js
│   │   └── Application.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── internships.js
│   │   └── applications.js
│   ├── .env.example         # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   ├── seeder.js           # Database seeder
│   ├── server.js           # Entry point
│   └── README.md           # Backend documentation
├── src/                     # Frontend React application
│   ├── services/           # API service layer
│   │   ├── api.js         # Axios instance
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── internshipService.js
│   │   └── applicationService.js
│   ├── App.js             # Main application component
│   ├── App.css            # Application styles
│   ├── LoginPage.js       # Login component
│   ├── LoginPage.css      # Login styles
│   └── index.js           # Entry point
├── public/                 # Public assets
├── .env                   # Frontend environment variables
├── .gitignore
├── package.json
└── README.md              # This file
```

## 🔑 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/intern4all
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

## 👤 Test Credentials

After seeding the database, you can login with these credentials:

**Regular User:**
- Email: `aman@example.com`
- Password: `password`

**Admin User:**
- Email: `admin@intern4all.com`
- Password: `password123`

**Company User:**
- Email: `company@example.com`
- Password: `password123`

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user |
| GET | `/auth/logout` | Logout user |
| GET | `/auth/google` | Google OAuth login |

### Internship Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/internships` | Get all internships |
| GET | `/internships/:id` | Get single internship |
| POST | `/internships` | Create internship (Admin/Company) |
| GET | `/internships/recommendations/me` | Get AI recommendations |

### Application Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/applications` | Get my applications |
| POST | `/applications` | Apply to internship |
| GET | `/applications/:id` | Get application details |

For complete API documentation, see [Backend README](./backend/README.md)

## 🎯 Usage Guide

### For Students

1. **Register/Login** - Create an account or login with Google
2. **Complete Profile** - Add your skills, education, and preferences
3. **Browse Internships** - View AI-recommended internships based on your profile
4. **Apply** - Submit applications with cover letters
5. **Track Applications** - Monitor application status in your dashboard
6. **Get Help** - Use the AI assistant for any questions

### For Companies (Admin/Company Role)

1. **Post Internships** - Create internship listings
2. **Review Applications** - View and manage applications
3. **Update Status** - Accept, reject, or shortlist candidates
4. **View Analytics** - Track application metrics

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection
- Verify `MONGODB_URI` in backend `.env` file
- Check firewall settings and network connectivity

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# For backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that backend is running before starting frontend

### Authentication Issues
- Clear browser localStorage and cookies
- Verify JWT_SECRET is set in backend `.env`
- Check token expiration settings

## 📦 Building for Production

### Frontend Build
```bash
npm run build
```

### Backend Production
```bash
cd backend
NODE_ENV=production npm start
```

## 🚢 Deployment

### Recommended Platforms

**Frontend:**
- Vercel
- Netlify
- GitHub Pages

**Backend:**
- Heroku
- Railway
- Render
- AWS EC2

**Database:**
- MongoDB Atlas (recommended)

### Environment Variables for Production

Update the following for production:
- `NODE_ENV=production`
- `MONGODB_URI` - MongoDB Atlas connection string
- `FRONTEND_URL` - Your production frontend URL
- `JWT_SECRET` - Strong random secret
- Enable HTTPS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Developed by Aman Yadav

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the database
- Google for Gemini AI API
- All open-source contributors

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@intern4all.com

---

**Happy Coding! 🚀**
