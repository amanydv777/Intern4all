# Intern4All - API Documentation

Complete API reference for the Intern4All backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens.

### Headers

```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Getting a Token

Tokens are returned upon successful login or registration.

---

## 📍 Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "",
    "profile": {
      "education": "",
      "studyField": "",
      "skills": [],
      "sectors": [],
      "preferredLocations": [],
      "availability": "",
      "isComplete": false
    }
  }
}
```

**Validation Rules:**
- `name`: Required, max 50 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

---

### Login User

Authenticate and get access token.

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "",
    "profile": { ... }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Current User

Get authenticated user's information.

**Endpoint:** `GET /auth/me`

**Access:** Private

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-1234567890",
    "location": "Delhi",
    "role": "user",
    "profile": {
      "education": "Undergraduate",
      "studyField": "Computer Science",
      "skills": ["JavaScript", "React", "Node.js"],
      "sectors": ["Technology", "Education"],
      "preferredLocations": ["Delhi", "Remote"],
      "availability": "Immediately",
      "isComplete": true
    },
    "createdAt": "2023-06-25T10:30:00.000Z"
  }
}
```

---

### Update User Details

Update basic user information.

**Endpoint:** `PUT /auth/updatedetails`

**Access:** Private

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "phone": "+91-9876543210",
  "location": "Mumbai"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### Update Password

Change user password.

**Endpoint:** `PUT /auth/updatepassword`

**Access:** Private

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "new_jwt_token..."
}
```

---

### Logout

Logout user and clear cookie.

**Endpoint:** `GET /auth/logout`

**Access:** Private

**Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

---

### Google OAuth Login

Initiate Google OAuth flow.

**Endpoint:** `GET /auth/google`

**Access:** Public

**Description:** Redirects to Google login page.

---

### Google OAuth Callback

Handle Google OAuth callback.

**Endpoint:** `GET /auth/google/callback`

**Access:** Public

**Description:** Processes Google authentication and redirects to frontend with token.

---

## 👤 User Profile Endpoints

### Get User Profile

Get complete user profile.

**Endpoint:** `GET /users/profile`

**Access:** Private

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "profile": {
      "education": "Undergraduate",
      "studyField": "Computer Science",
      "skills": ["JavaScript", "React"],
      "sectors": ["Technology"],
      "preferredLocations": ["Delhi"],
      "availability": "Immediately",
      "isComplete": true
    }
  }
}
```

---

### Update User Profile

Update profile information (skills, education, preferences).

**Endpoint:** `PUT /users/profile`

**Access:** Private

**Request Body:**
```json
{
  "education": "Graduate",
  "studyField": "Computer Science",
  "skills": ["JavaScript", "React", "Node.js", "Python"],
  "sectors": ["Technology", "Finance"],
  "preferredLocations": ["Delhi", "Mumbai", "Remote"],
  "availability": "Immediately"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "profile": {
      "education": "Graduate",
      "studyField": "Computer Science",
      "skills": ["JavaScript", "React", "Node.js", "Python"],
      "sectors": ["Technology", "Finance"],
      "preferredLocations": ["Delhi", "Mumbai", "Remote"],
      "availability": "Immediately",
      "isComplete": true
    }
  }
}
```

---

## 💼 Internship Endpoints

### Get All Internships

Get list of internships with optional filtering and pagination.

**Endpoint:** `GET /internships`

**Access:** Public

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in title, company, description
- `sector` - Filter by sector
- `location` - Filter by location
- `status` - Filter by status (active/closed/draft)
- `sort` - Sort field (e.g., -createdAt)

**Example:**
```
GET /internships?page=1&limit=10&sector=Technology&location=Remote&search=developer
```

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "pagination": {
    "next": {
      "page": 2,
      "limit": 10
    }
  },
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "title": "Frontend Developer Intern",
      "company": "Microsoft",
      "companyLogo": "https://...",
      "description": "Work on building modern web applications...",
      "location": "Bangalore",
      "locationType": "Hybrid",
      "stipend": "₹ 25,000/month",
      "duration": "4 months",
      "startDate": "2025-01-20T00:00:00.000Z",
      "applicationDeadline": "2025-01-10T00:00:00.000Z",
      "tags": ["React", "JavaScript", "CSS"],
      "sector": "Technology",
      "skillsRequired": ["React", "JavaScript", "CSS", "HTML"],
      "numberOfOpenings": 5,
      "applicationsCount": 12,
      "status": "active",
      "postedBy": {
        "_id": "60d5ec49f1b2c72b8c8e4f1c",
        "name": "Company User",
        "email": "company@example.com"
      },
      "createdAt": "2023-06-25T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Internship

Get detailed information about a specific internship.

**Endpoint:** `GET /internships/:id`

**Access:** Public

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1b",
    "title": "Frontend Developer Intern",
    "company": "Microsoft",
    "description": "Work on building modern web applications...",
    "requirements": [
      "Strong knowledge of HTML, CSS, and JavaScript",
      "Experience with React or similar frameworks"
    ],
    "responsibilities": [
      "Develop and maintain web applications",
      "Implement responsive UI components"
    ],
    "location": "Bangalore",
    "locationType": "Hybrid",
    "stipend": "₹ 25,000/month",
    "duration": "4 months",
    "startDate": "2025-01-20T00:00:00.000Z",
    "applicationDeadline": "2025-01-10T00:00:00.000Z",
    "tags": ["React", "JavaScript", "CSS"],
    "sector": "Technology",
    "skillsRequired": ["React", "JavaScript", "CSS", "HTML"],
    "numberOfOpenings": 5,
    "applicationsCount": 12,
    "status": "active",
    "postedBy": {
      "_id": "60d5ec49f1b2c72b8c8e4f1c",
      "name": "Company User",
      "email": "company@example.com"
    }
  }
}
```

---

### Create Internship

Create a new internship listing (Admin/Company only).

**Endpoint:** `POST /internships`

**Access:** Private (Admin/Company)

**Request Body:**
```json
{
  "title": "Backend Developer Intern",
  "company": "TechCorp",
  "companyLogo": "https://example.com/logo.png",
  "description": "Join our backend team to build scalable APIs...",
  "requirements": [
    "Knowledge of Node.js and Express",
    "Understanding of RESTful APIs"
  ],
  "responsibilities": [
    "Develop and maintain backend services",
    "Write clean, testable code"
  ],
  "location": "Remote",
  "locationType": "Remote",
  "stipend": "₹ 30,000/month",
  "duration": "6 months",
  "startDate": "2025-02-01",
  "applicationDeadline": "2025-01-15",
  "tags": ["Node.js", "Express", "MongoDB"],
  "sector": "Technology",
  "skillsRequired": ["Node.js", "Express", "MongoDB", "JavaScript"],
  "numberOfOpenings": 3
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### Update Internship

Update internship details (Admin/Company only).

**Endpoint:** `PUT /internships/:id`

**Access:** Private (Admin/Company - must be owner)

**Request Body:** (any fields to update)
```json
{
  "stipend": "₹ 35,000/month",
  "numberOfOpenings": 5,
  "status": "active"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### Delete Internship

Delete an internship (Admin/Company only).

**Endpoint:** `DELETE /internships/:id`

**Access:** Private (Admin/Company - must be owner)

**Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

---

### Get AI Recommendations

Get personalized internship recommendations based on user profile.

**Endpoint:** `GET /internships/recommendations/me`

**Access:** Private

**Requirements:** User profile must be complete

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "title": "Frontend Developer Intern",
      "company": "Microsoft",
      "location": "Bangalore",
      "stipend": "₹ 25,000/month",
      "tags": ["React", "JavaScript"],
      "sector": "Technology"
    }
  ]
}
```

---

## 📝 Application Endpoints

### Get My Applications

Get all applications submitted by the current user.

**Endpoint:** `GET /applications`

**Access:** Private

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1d",
      "internship": {
        "_id": "60d5ec49f1b2c72b8c8e4f1b",
        "title": "Frontend Developer Intern",
        "company": "Microsoft",
        "location": "Bangalore",
        "stipend": "₹ 25,000/month",
        "status": "active"
      },
      "applicant": "60d5ec49f1b2c72b8c8e4f1a",
      "status": "pending",
      "coverLetter": "I am very interested in this position...",
      "aiMatchScore": 85,
      "createdAt": "2023-06-26T10:30:00.000Z",
      "updatedAt": "2023-06-26T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Application

Get details of a specific application.

**Endpoint:** `GET /applications/:id`

**Access:** Private (must be applicant or admin)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1d",
    "internship": {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "title": "Frontend Developer Intern",
      "company": "Microsoft",
      "description": "...",
      "requirements": [...]
    },
    "applicant": {
      "_id": "60d5ec49f1b2c72b8c8e4f1a",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91-1234567890",
      "profile": { ... }
    },
    "status": "pending",
    "coverLetter": "I am very interested...",
    "answers": [
      {
        "question": "Why do you want this internship?",
        "answer": "Because..."
      }
    ],
    "aiMatchScore": 85,
    "createdAt": "2023-06-26T10:30:00.000Z"
  }
}
```

---

### Create Application

Apply to an internship.

**Endpoint:** `POST /applications`

**Access:** Private

**Request Body:**
```json
{
  "internshipId": "60d5ec49f1b2c72b8c8e4f1b",
  "coverLetter": "I am very interested in this position because...",
  "answers": [
    {
      "question": "Why do you want this internship?",
      "answer": "I want to learn and grow..."
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1d",
    "internship": "60d5ec49f1b2c72b8c8e4f1b",
    "applicant": "60d5ec49f1b2c72b8c8e4f1a",
    "status": "pending",
    "coverLetter": "I am very interested...",
    "aiMatchScore": 85,
    "createdAt": "2023-06-26T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "You have already applied to this internship"
}
```

---

### Update Application Status

Update the status of an application (Admin/Company only).

**Endpoint:** `PUT /applications/:id/status`

**Access:** Private (Admin/Company - must be internship owner)

**Request Body:**
```json
{
  "status": "shortlisted",
  "notes": "Great candidate, proceed to interview"
}
```

**Status Options:**
- `pending`
- `reviewing`
- `shortlisted`
- `rejected`
- `accepted`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1d",
    "status": "shortlisted",
    "notes": "Great candidate, proceed to interview",
    "reviewedBy": "60d5ec49f1b2c72b8c8e4f1c",
    "reviewedAt": "2023-06-27T10:30:00.000Z"
  }
}
```

---

### Delete Application

Delete/withdraw an application.

**Endpoint:** `DELETE /applications/:id`

**Access:** Private (must be applicant)

**Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

---

### Get Internship Applications

Get all applications for a specific internship (Admin/Company only).

**Endpoint:** `GET /internships/:internshipId/applications`

**Access:** Private (Admin/Company - must be internship owner)

**Response (200):**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1d",
      "applicant": {
        "_id": "60d5ec49f1b2c72b8c8e4f1a",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91-1234567890",
        "profile": {
          "education": "Undergraduate",
          "skills": ["JavaScript", "React"],
          "sectors": ["Technology"]
        }
      },
      "status": "pending",
      "coverLetter": "...",
      "aiMatchScore": 85,
      "createdAt": "2023-06-26T10:30:00.000Z"
    }
  ]
}
```

---

## 🔒 Admin Endpoints

### Get All Users

Get list of all users (Admin only).

**Endpoint:** `GET /users`

**Access:** Private (Admin)

**Response (200):**
```json
{
  "success": true,
  "count": 50,
  "data": [...]
}
```

---

### Get Single User

Get details of a specific user (Admin only).

**Endpoint:** `GET /users/:id`

**Access:** Private (Admin)

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### Delete User

Delete a user (Admin only).

**Endpoint:** `DELETE /users/:id`

**Access:** Private (Admin)

**Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

---

## 🔍 Error Responses

### Standard Error Format

```json
{
  "success": false,
  "message": "Error message here"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

### Example Validation Error

```json
{
  "success": false,
  "errors": [
    {
      "msg": "Please provide a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

## 📊 Rate Limiting

- **Limit:** 100 requests per 10 minutes per IP
- **Response when exceeded:**
  ```json
  {
    "success": false,
    "message": "Too many requests from this IP, please try again later."
  }
  ```

---

## 🔐 Security

- All passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- CORS is enabled for frontend URL only
- Input sanitization prevents NoSQL injection
- Helmet.js provides security headers
- Rate limiting prevents abuse

---

## 📝 Notes

- All dates are in ISO 8601 format
- All responses include `success` boolean
- Pagination uses `page` and `limit` query parameters
- Sorting uses MongoDB syntax (e.g., `-createdAt` for descending)
- Search is case-insensitive and uses text indexes

---

**For more information, see the [Backend README](./backend/README.md)**
