# Intern4All Backend API

A production-ready MERN stack backend for the Intern4All internship platform with JWT authentication, Google OAuth, and AI-powered matching.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Google OAuth 2.0 integration
  - Role-based access control (User, Company, Admin)
  - Secure password hashing with bcrypt

- **User Management**
  - Complete user profiles with skills and preferences
  - Profile completion tracking
  - User preferences for AI matching

- **Internship Management**
  - CRUD operations for internships
  - Advanced search and filtering
  - AI-powered recommendations based on user profile
  - Application deadline tracking

- **Application System**
  - Apply to internships with cover letters
  - AI match scoring
  - Application status tracking
  - Company can review and update application status

- **Security**
  - Helmet.js for security headers
  - Rate limiting
  - MongoDB sanitization
  - CORS configuration
  - Input validation

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT, Passport.js (Google OAuth)
- **Security:** Helmet, express-rate-limit, express-mongo-sanitize
- **Validation:** express-validator

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google OAuth credentials (optional, for Google login)

### Setup

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

   Update the following variables in `.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/intern4all
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   JWT_COOKIE_EXPIRE=7
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=https://intern4all-backend.onrender.com/api/auth/google/callback
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Seed the database (optional):**
   ```bash
   node seeder.js -i
   ```
   This creates sample users, internships, and data for testing.

6. **Start the server:**
   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `https://intern4all-backend.onrender.com`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/updatedetails` | Update user details | Private |
| PUT | `/updatepassword` | Update password | Private |
| GET | `/logout` | Logout user | Private |
| GET | `/google` | Initiate Google OAuth | Public |
| GET | `/google/callback` | Google OAuth callback | Public |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/profile` | Get user profile | Private |
| PUT | `/profile` | Update user profile | Private |
| GET | `/` | Get all users | Admin |
| GET | `/:id` | Get single user | Admin |
| DELETE | `/:id` | Delete user | Admin |

### Internship Routes (`/api/internships`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all internships | Public |
| GET | `/:id` | Get single internship | Public |
| POST | `/` | Create internship | Admin/Company |
| PUT | `/:id` | Update internship | Admin/Company |
| DELETE | `/:id` | Delete internship | Admin/Company |
| GET | `/recommendations/me` | Get AI recommendations | Private |
| GET | `/:internshipId/applications` | Get internship applications | Admin/Company |

### Application Routes (`/api/applications`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get my applications | Private |
| GET | `/:id` | Get single application | Private |
| POST | `/` | Create application | Private |
| PUT | `/:id/status` | Update application status | Admin/Company |
| DELETE | `/:id` | Delete application | Private |

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Create Application
```bash
POST /api/applications
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "internshipId": "60d5ec49f1b2c72b8c8e4f1b",
  "coverLetter": "I am very interested in this position...",
  "answers": [
    {
      "question": "Why do you want this internship?",
      "answer": "Because..."
    }
  ]
}
```

## Database Models

### User Model
- name, email, password (hashed)
- phone, location, avatar
- role (user/admin/company)
- authProvider (local/google)
- profile (education, skills, sectors, preferences)

### Internship Model
- title, company, description
- location, stipend, duration
- requirements, responsibilities
- tags, sector, skillsRequired
- startDate, applicationDeadline
- status (active/closed/draft)

### Application Model
- internship (ref), applicant (ref)
- status (pending/reviewing/shortlisted/rejected/accepted)
- coverLetter, resume, answers
- aiMatchScore

## Testing

### Test Credentials (after seeding)

**Admin User:**
- Email: `admin@intern4all.com`
- Password: `password123`

**Regular User:**
- Email: `aman@example.com`
- Password: `password`

**Company User:**
- Email: `company@example.com`
- Password: `password123`

### Health Check
```bash
curl https://intern4all-backend.onrender.com/api/health
```

## Deployment

### Environment Variables for Production

Ensure these are set in production:
- `NODE_ENV=production`
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Strong secret key
- `FRONTEND_URL` - Production frontend URL
- Google OAuth credentials (if using)

### Recommended Hosting

- **Backend:** Heroku, Railway, Render, or AWS
- **Database:** MongoDB Atlas
- **Environment:** Node.js 14+

## Security Best Practices

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use strong JWT_SECRET** - Generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. **Enable HTTPS** in production
4. **Regular dependency updates** - Run `npm audit` regularly
5. **Rate limiting** - Already configured, adjust as needed
6. **Input validation** - All routes have validation middleware

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, whitelist your IP address

### Authentication Errors
- Verify JWT_SECRET is set
- Check token expiration settings
- Ensure Authorization header format: `Bearer <token>`

### Google OAuth Issues
- Verify Google OAuth credentials
- Check callback URL matches Google Console
- Ensure redirect URIs are whitelisted

## Scripts

```bash
# Start development server
npm run dev

# Start production server
npm start

# Seed database
node seeder.js -i

# Clear database
node seeder.js -d

# Run tests (if configured)
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub or contact the development team.
