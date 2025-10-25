# Testing Guide - Intern4All

## 🧪 Comprehensive Testing Guide

This guide covers all testing scenarios for the Intern4All platform.

---

## Table of Contents
1. [Manual Testing](#manual-testing)
2. [API Testing](#api-testing)
3. [Security Testing](#security-testing)
4. [Performance Testing](#performance-testing)
5. [User Acceptance Testing](#user-acceptance-testing)

---

## Manual Testing

### 1. User Registration Flow

#### Test Case 1.1: Successful Registration (Intern)
**Steps:**
1. Navigate to the application
2. Click "Need an account? Sign up"
3. Enter valid details:
   - Name: "Test User"
   - Role: Select "Intern"
   - Email: "testuser@example.com"
   - Password: "password123"
   - Confirm Password: "password123"
   - Security Key: "mySecretKey123"
4. Click "Sign Up"

**Expected Result:**
- ✅ User is registered successfully
- ✅ User is automatically logged in
- ✅ Redirected to dashboard
- ✅ Security key is stored (hashed)

#### Test Case 1.2: Successful Registration (Recruiter)
**Steps:**
1. Follow steps 1-2 from Test Case 1.1
2. Enter valid details with Role: "Recruiter"
3. Click "Sign Up"

**Expected Result:**
- ✅ Recruiter account created
- ✅ Different dashboard view for recruiters

#### Test Case 1.3: Registration Validation Errors
**Test scenarios:**

| Scenario | Input | Expected Error |
|----------|-------|----------------|
| Missing name | Empty name field | "Please provide a name" |
| Invalid email | "notanemail" | "Please provide a valid email" |
| Short password | "12345" | "Password must be at least 6 characters" |
| Password mismatch | Different passwords | "Passwords do not match" |
| Short security key | "123" | "Security key must be at least 4 characters" |
| Missing security key | Empty security key | "Security key must be at least 4 characters" |
| Duplicate email | Existing email | "User already exists with this email" |

### 2. Login Flow

#### Test Case 2.1: Successful Login
**Steps:**
1. Navigate to login page
2. Enter credentials:
   - Email: "testuser@example.com"
   - Password: "password123"
3. Click "Sign In"

**Expected Result:**
- ✅ User is logged in
- ✅ Redirected to dashboard
- ✅ Token stored in localStorage
- ✅ User data displayed correctly

#### Test Case 2.2: Login Validation Errors
**Test scenarios:**

| Scenario | Input | Expected Error |
|----------|-------|----------------|
| Wrong password | Correct email, wrong password | "Invalid credentials" |
| Non-existent email | "nonexistent@example.com" | "Invalid credentials" |
| Empty fields | Empty email/password | "Please provide an email and password" |

### 3. Forgot Password Flow

#### Test Case 3.1: Successful Password Reset
**Steps:**
1. Click "Forgot password?" on login page
2. Enter email: "testuser@example.com"
3. Enter security key: "mySecretKey123"
4. Click "Send Reset Link"
5. Wait for redirect to reset password page
6. Enter new password: "newPassword123"
7. Confirm new password: "newPassword123"
8. Click "Reset Password"

**Expected Result:**
- ✅ Security key verified successfully
- ✅ Redirected to reset password page
- ✅ Password updated successfully
- ✅ Can login with new password
- ✅ Old password no longer works

#### Test Case 3.2: Forgot Password Validation Errors
**Test scenarios:**

| Scenario | Input | Expected Error |
|----------|-------|----------------|
| Wrong security key | Correct email, wrong key | "Invalid security key" |
| Non-existent email | "nonexistent@example.com" | "No user found with that email" |
| Empty security key | Email only | "Please enter your security key" |

### 4. Profile Management

#### Test Case 4.1: Complete Profile (Basic Info)
**Steps:**
1. Login as intern
2. Navigate to Profile section
3. Fill in basic information:
   - Phone: "1234567890"
   - Location: "New York"
   - Education: "Undergraduate"
   - Field of Study: "Computer Science"
   - University: "Test University"
4. Click "Next"

**Expected Result:**
- ✅ Information saved successfully
- ✅ Moved to Skills & Interests section

#### Test Case 4.2: Add Skills and Sectors
**Steps:**
1. Continue from Test Case 4.1
2. Add skills: "JavaScript", "React", "Node.js"
3. Select sectors: "Technology", "Software Development"
4. Click "Next"

**Expected Result:**
- ✅ Skills and sectors saved
- ✅ Moved to Preferences section

#### Test Case 4.3: Set Preferences
**Steps:**
1. Continue from Test Case 4.2
2. Select preferred location: "Remote"
3. Select availability: "Immediately"
4. Click "Complete Profile"

**Expected Result:**
- ✅ Profile marked as complete
- ✅ AI recommendations become available
- ✅ Profile completion indicator shows 100%

### 5. Internship Browsing

#### Test Case 5.1: View Internship List
**Steps:**
1. Login as intern
2. Navigate to "Find Internships"

**Expected Result:**
- ✅ List of internships displayed
- ✅ Each card shows: title, company, location, stipend
- ✅ Filter options available

#### Test Case 5.2: View Internship Details
**Steps:**
1. Click on any internship card
2. Review details page

**Expected Result:**
- ✅ Full internship details displayed
- ✅ Description, requirements, responsibilities shown
- ✅ "Apply Now" button visible (for interns)
- ✅ Application deadline and other details shown

### 6. Application Submission

#### Test Case 6.1: Successful Application Submission
**Steps:**
1. Navigate to internship details
2. Click "Apply Now"
3. Application modal opens
4. Enter cover letter (min 50 characters):
   ```
   I am very interested in this internship opportunity because 
   of my strong background in the required skills and my passion 
   for the industry. I believe I would be a great fit for this role.
   ```
5. Click "Submit Application"

**Expected Result:**
- ✅ Application submitted successfully
- ✅ Success message displayed
- ✅ Redirected back to internship list
- ✅ Application appears in "My Applications"
- ✅ AI match score calculated

#### Test Case 6.2: Application Validation
**Test scenarios:**

| Scenario | Input | Expected Error |
|----------|-------|----------------|
| Empty cover letter | No text | "Please write a cover letter" |
| Already applied | Apply twice | "You have already applied to this internship" |
| Deadline passed | Past deadline | "Application deadline has passed" |
| Inactive internship | Closed internship | "This internship is no longer accepting applications" |

### 7. My Applications

#### Test Case 7.1: View My Applications
**Steps:**
1. Login as intern
2. Navigate to "My Applications"

**Expected Result:**
- ✅ List of all applications displayed
- ✅ Shows internship title, company, status
- ✅ Can view application details
- ✅ Status badges displayed correctly

#### Test Case 7.2: Application Status Updates
**Verify all status types display correctly:**
- Applied (default)
- Under Review
- Interview
- Offer
- Rejected
- Shortlisted

### 8. Recruiter Features

#### Test Case 8.1: Post Internship
**Steps:**
1. Login as recruiter
2. Click "Post Internship"
3. Fill in all details
4. Submit

**Expected Result:**
- ✅ Internship created successfully
- ✅ Appears in internship list
- ✅ Recruiter can view applications

#### Test Case 8.2: View Applications (Recruiter)
**Steps:**
1. Login as recruiter
2. View posted internship
3. Click "View Applications"

**Expected Result:**
- ✅ All applications displayed
- ✅ Sorted by AI match score
- ✅ Can update application status
- ✅ Can add notes

---

## API Testing

### Using cURL

#### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "apitest@example.com",
    "password": "password123",
    "role": "intern",
    "securityKey": "apiSecretKey123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "API Test User",
    "email": "apitest@example.com",
    "role": "intern"
  }
}
```

#### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "password123"
  }'
```

#### 3. Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/forgotpassword \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "securityKey": "apiSecretKey123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Security key verified. Password reset token generated.",
  "resetToken": "..."
}
```

#### 4. Reset Password
```bash
curl -X PUT http://localhost:5000/api/auth/resetpassword/RESET_TOKEN \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newPassword123"
  }'
```

#### 5. Get Current User (Protected Route)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 6. Submit Application
```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "internshipId": "INTERNSHIP_ID",
    "coverLetter": "I am very interested in this position...",
    "answers": []
  }'
```

#### 7. Get My Applications
```bash
curl -X GET http://localhost:5000/api/applications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. **Import Collection**: Create a new collection "Intern4All API"
2. **Set Environment Variables**:
   - `base_url`: http://localhost:5000/api
   - `token`: (will be set after login)
3. **Add Requests**: Create requests for all endpoints
4. **Test Scripts**: Add automated tests

Example test script for login:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.token).to.exist;
    pm.environment.set("token", jsonData.token);
});
```

---

## Security Testing

### 1. Authentication Security

#### Test Case S1: JWT Token Validation
**Test:**
- Try accessing protected routes without token
- Try with expired token
- Try with invalid token

**Expected:**
- All should return 401 Unauthorized

#### Test Case S2: Password Security
**Verify:**
- ✅ Passwords are hashed (not stored in plain text)
- ✅ Security keys are hashed
- ✅ Minimum password length enforced
- ✅ Password confirmation required

#### Test Case S3: SQL/NoSQL Injection
**Test with malicious inputs:**
```javascript
// Login with injection attempt
{
  "email": {"$gt": ""},
  "password": {"$gt": ""}
}
```

**Expected:**
- ✅ Request sanitized
- ✅ Injection attempt blocked

### 2. Rate Limiting

#### Test Case S4: Rate Limit Enforcement
**Steps:**
1. Make 100+ requests to any endpoint within 10 minutes
2. Observe response

**Expected:**
- ✅ After 100 requests: "Too many requests from this IP"
- ✅ Status code 429

### 3. CORS Testing

#### Test Case S5: CORS Policy
**Test:**
- Make request from unauthorized origin

**Expected:**
- ✅ Request blocked by CORS policy

---

## Performance Testing

### 1. Load Testing

#### Using Apache Bench
```bash
# Test login endpoint
ab -n 1000 -c 10 -p login.json -T application/json \
  http://localhost:5000/api/auth/login
```

**Metrics to monitor:**
- Requests per second
- Average response time
- Failed requests (should be 0)

#### Using Artillery
```yaml
# artillery-config.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Browse internships"
    flow:
      - get:
          url: "/api/internships"
```

Run: `artillery run artillery-config.yml`

### 2. Database Performance

**Monitor:**
- Query execution time
- Connection pool usage
- Index usage

**Optimize:**
- Add indexes for frequently queried fields
- Use lean() for read-only queries
- Implement caching for static data

---

## User Acceptance Testing (UAT)

### Scenario 1: Student Finding Internship
**User Story:** As a student, I want to find and apply for internships

**Steps:**
1. Register as intern
2. Complete profile with skills
3. Browse AI-recommended internships
4. Apply to 3 internships
5. Track application status

**Success Criteria:**
- ✅ Registration smooth and intuitive
- ✅ Profile completion easy to understand
- ✅ Recommendations are relevant
- ✅ Application process is straightforward
- ✅ Can track all applications

### Scenario 2: Recruiter Posting Internship
**User Story:** As a recruiter, I want to post internships and review applications

**Steps:**
1. Register as recruiter
2. Post new internship
3. Wait for applications
4. Review applications
5. Update application statuses

**Success Criteria:**
- ✅ Posting process is clear
- ✅ Can view all applications
- ✅ AI match scores are helpful
- ✅ Can manage application statuses

### Scenario 3: Password Recovery
**User Story:** As a user who forgot password, I want to reset it using my security key

**Steps:**
1. Click "Forgot password?"
2. Enter email and security key
3. Reset password
4. Login with new password

**Success Criteria:**
- ✅ Process is clear and secure
- ✅ Security key verification works
- ✅ Can login with new password immediately

---

## Automated Testing (Future Implementation)

### Unit Tests (Jest)
```javascript
// Example: Test password hashing
describe('User Model', () => {
  it('should hash password before saving', async () => {
    const user = new User({
      name: 'Test',
      email: 'test@test.com',
      password: 'password123',
      securityKey: 'key123'
    });
    await user.save();
    expect(user.password).not.toBe('password123');
  });
});
```

### Integration Tests (Supertest)
```javascript
// Example: Test registration endpoint
describe('POST /api/auth/register', () => {
  it('should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'intern',
        securityKey: 'key123'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

### E2E Tests (Cypress)
```javascript
// Example: Test login flow
describe('Login Flow', () => {
  it('should login successfully', () => {
    cy.visit('/');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

---

## Test Data

### Sample Users
```javascript
// Intern
{
  email: "intern@test.com",
  password: "password123",
  securityKey: "internKey123"
}

// Recruiter
{
  email: "recruiter@test.com",
  password: "password123",
  securityKey: "recruiterKey123"
}

// Admin
{
  email: "admin@test.com",
  password: "password123",
  securityKey: "adminKey123"
}
```

---

## Bug Reporting Template

When reporting bugs, include:

```markdown
**Bug Title:** [Brief description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happened

**Screenshots:**
[If applicable]

**Environment:**
- Browser: Chrome 120
- OS: macOS 14
- Screen size: 1920x1080

**Console Errors:**
[Any error messages]
```

---

## Testing Checklist

### Pre-Release Testing
- [ ] All manual test cases pass
- [ ] API endpoints tested
- [ ] Security tests pass
- [ ] Performance acceptable
- [ ] Cross-browser testing complete
- [ ] Mobile responsive testing done
- [ ] UAT scenarios successful
- [ ] No console errors
- [ ] All links work
- [ ] Forms validate correctly

### Production Smoke Test
- [ ] Homepage loads
- [ ] Registration works
- [ ] Login works
- [ ] Password reset works
- [ ] Application submission works
- [ ] Profile update works
- [ ] No critical errors in logs

---

**Last Updated:** December 2024  
**Version:** 1.0.0
