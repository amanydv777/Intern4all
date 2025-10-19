# Recruiter Role Implementation Guide

## Overview
This guide documents all changes made to implement the recruiter role and associated features.

## Backend Changes Completed ✅

### 1. User Model Updated
**File:** `backend/models/User.js`
- Changed role enum from `['user', 'admin', 'company']` to `['intern', 'recruiter', 'admin']`
- Default role is now `'intern'`

### 2. Auth Controller Updated
**File:** `backend/controllers/authController.js`
- Registration now accepts `role` parameter
- Validates role is either 'intern' or 'recruiter'
- Defaults to 'intern' if invalid role provided

### 3. New Internship Controller Endpoints
**File:** `backend/controllers/internshipController.js`

Added two new endpoints:

#### `getMyPostings`
- Route: `GET /api/internships/my-postings/all`
- Access: Recruiter/Admin only
- Returns all internships posted by the logged-in recruiter

#### `getRecruiterStats`
- Route: `GET /api/internships/recruiter-stats/dashboard`
- Access: Recruiter/Admin only
- Returns dashboard statistics:
  - Total postings
  - Active postings
  - Total applications
  - Pending/Accepted/Rejected applications

### 4. Routes Updated
**File:** `backend/routes/internships.js`
- Changed authorization from `'company'` to `'recruiter'` for all internship CRUD operations
- Added routes for `getMyPostings` and `getRecruiterStats`
- Updated application viewing authorization to include `'recruiter'`

### 5. Seeder Updated
**File:** `backend/seeder.js`
- Replaced 'Company User' with 'Tech Recruiter'
- Email: `recruiter@example.com`
- Password: `password123`
- Role: `recruiter`
- Changed Aman's role from `'user'` to `'intern'`

## Frontend Changes Needed

### 1. Add Translations for Telugu and Gujarati

The translations object needs to be expanded. Here's the structure needed:

```javascript
const translations = {
    nav: {
        dashboard: { 
            EN: "Dashboard", 
            HI: "डैशबोर्ड",
            TE: "డాష్‌బోర్డ్",
            GU: "ડેશબોર્ડ"
        },
        // ... repeat for all nav items
    },
    // ... repeat for all sections
};
```

### 2. Time-Aware Greeting

Replace static "Good morning" with dynamic greeting:

```javascript
const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 17) return t('dashboard.goodAfternoon');
    if (hour < 21) return t('dashboard.goodEvening');
    return t('dashboard.goodNight');
};
```

Add to translations:
```javascript
dashboard: {
    goodMorning: { EN: "Good morning", HI: "सुप्रभात", TE: "శుభోదయం", GU: "સુપ્રભાત" },
    goodAfternoon: { EN: "Good afternoon", HI: "नमस्ते", TE: "శుభ మధ్యాహ్నం", GU: "શુભ બપોર" },
    goodEvening: { EN: "Good evening", HI: "शुभ संध्या", TE: "శుభ సాయంత్రం", GU: "શુભ સાંજ" },
    goodNight: { EN: "Good night", HI: "शुभ रात्रि", TE: "శుభ రాత్రి", GU: "શુભ રાત્રિ" },
}
```

### 3. Update Sidebar Component

Add language switcher and notifications to desktop view:

```javascript
const Sidebar = ({ isOpen, onClose, activePage, setActivePage, openAssistant, user, onLogout }) => {
  const { t, language, changeLanguage, languages } = useContext(LanguageContext);
  const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
  
  // ... existing code ...
  
  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* ... existing nav items ... */}
        
        {/* Add at bottom of sidebar */}
        <div className="sidebar-footer">
          <div className="language-selector">
            <button onClick={() => setLangDropdownOpen(!isLangDropdownOpen)}>
              <LuGlobe /> {language.name}
            </button>
            {isLangDropdownOpen && (
              <div className="lang-dropdown">
                {languages.map(lang => (
                  <div key={lang.code} onClick={() => {
                    changeLanguage(lang.code);
                    setLangDropdownOpen(false);
                  }}>
                    {lang.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="notifications-btn">
            <LuBell /> Notifications
          </button>
        </div>
      </div>
    </>
  );
};
```

### 4. Update SignUp Page with Role Selection

```javascript
const SignUpPage = ({ onSignUpSuccess, onBackToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('intern'); // NEW
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    // ... validation code ...
    
    try {
      const response = await authService.register({ 
        name, 
        email, 
        password,
        role // Include role in registration
      });
      onSignUpSuccess(response.user);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* ... existing fields ... */}
        
        {/* Add role selection */}
        <div className="role-selection">
          <label>I am a:</label>
          <div className="role-options">
            <label className={`role-option ${role === 'intern' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="intern"
                checked={role === 'intern'}
                onChange={(e) => setRole(e.target.value)}
              />
              <div className="role-card">
                <LuUser size={32} />
                <h4>Intern</h4>
                <p>Looking for internship opportunities</p>
              </div>
            </label>
            <label className={`role-option ${role === 'recruiter' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="recruiter"
                checked={role === 'recruiter'}
                onChange={(e) => setRole(e.target.value)}
              />
              <div className="role-card">
                <LuBriefcase size={32} />
                <h4>Recruiter</h4>
                <p>Post internship opportunities</p>
              </div>
            </label>
          </div>
        </div>
        
        {/* ... rest of form ... */}
      </div>
    </div>
  );
};
```

### 5. Create Recruiter Dashboard Component

```javascript
const RecruiterDashboard = ({ setActivePage, user }) => {
  const { t } = useContext(LanguageContext);
  const [stats, setStats] = useState(null);
  const [myPostings, setMyPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recruiter stats
        const statsResponse = await internshipService.getRecruiterStats();
        setStats(statsResponse.data);
        
        // Fetch my postings
        const postingsResponse = await internshipService.getMyPostings();
        setMyPostings(postingsResponse.data);
      } catch (error) {
        console.error('Failed to fetch recruiter data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 17) return t('dashboard.goodAfternoon');
    if (hour < 21) return t('dashboard.goodEvening');
    return t('dashboard.goodNight');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>{getTimeBasedGreeting()}, {user?.name}! 👋</h1>
          <p>Manage your internship postings</p>
        </div>
        <button 
          className="primary-button" 
          onClick={() => setActivePage('Post Internship')}
        >
          Post Internship →
        </button>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard 
          title="Total Postings" 
          value={stats?.totalPostings || 0} 
          footer={`${stats?.activePostings || 0} active`}
          icon={<LuBriefcase />} 
          iconClass="blue" 
        />
        <StatCard 
          title="Total Applications" 
          value={stats?.totalApplications || 0} 
          footer={`${stats?.pendingApplications || 0} pending`}
          icon={<LuFileText />} 
          iconClass="green" 
        />
        <StatCard 
          title="Accepted" 
          value={stats?.acceptedApplications || 0} 
          footer="Candidates hired"
          icon={<LuCircleCheck />} 
          iconClass="green" 
        />
        <StatCard 
          title="Response Rate" 
          value={stats?.totalApplications > 0 
            ? `${Math.round(((stats.acceptedApplications + stats.rejectedApplications) / stats.totalApplications) * 100)}%`
            : '0%'
          } 
          footer="Applications reviewed"
          icon={<LuTrendingUp />} 
          iconClass="purple" 
        />
      </div>

      {/* My Postings */}
      <div className="dashboard-main-area">
        <div className="recommendations-card">
          <div className="card-header">
            <h3>📋 My Internship Postings</h3>
            <button 
              className="view-all-link" 
              onClick={() => setActivePage('My Postings')}
            >
              View All
            </button>
          </div>
          {myPostings.length === 0 ? (
            <div className="empty-state">
              <LuBriefcase size={48} />
              <h4>No postings yet</h4>
              <p>Create your first internship posting</p>
              <button 
                className="dark-button" 
                onClick={() => setActivePage('Post Internship')}
              >
                Post Internship
              </button>
            </div>
          ) : (
            <div className="recommendations-grid">
              {myPostings.slice(0, 5).map(internship => (
                <RecruiterInternshipCard 
                  key={internship._id} 
                  internship={internship}
                  onClick={() => setActivePage('View Applications')}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

### 6. Create Post Internship Form Component

```javascript
const PostInternshipPage = ({ onSuccess }) => {
  const { t } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: [],
    responsibilities: [],
    location: '',
    locationType: 'On-site',
    stipend: '',
    duration: '',
    startDate: '',
    applicationDeadline: '',
    sector: '',
    skillsRequired: [],
    numberOfOpenings: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await internshipService.createInternship(formData);
      alert('Internship posted successfully!');
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to post internship');
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-form-container">
      <div className="profile-header">
        <h1>Post New Internship</h1>
        <p>Fill in the details to create an internship posting</p>
      </div>
      <form onSubmit={handleSubmit} className="form-card">
        {/* Form fields */}
        <div className="form-group">
          <label>Job Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Company Name *</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            rows="5"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        {/* Add more fields for all required data */}
        
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? 'Posting...' : 'Post Internship'}
        </button>
      </form>
    </div>
  );
};
```

### 7. Update Main App Component

```javascript
function SkillSyncApp({ user, onLogout, onUserUpdate }) {
  const [activePage, setActivePage] = useState('Dashboard');
  // ... existing state ...

  const renderPage = () => {
    // Check user role
    const isRecruiter = user?.role === 'recruiter';
    
    switch (activePage) {
      case 'Profile': 
        return <ProfileCompletion onProfileComplete={handleProfileComplete} user={user} />;
      case 'My Applications':
        return isRecruiter 
          ? <MyPostingsPage /> 
          : <ApplicationsPage applications={applications} setApplications={setApplications} />;
      case 'Find Internships':
        return <FindInternshipsPage recommendations={recommendations} />;
      case 'Post Internship':
        return isRecruiter 
          ? <PostInternshipPage onSuccess={() => setActivePage('Dashboard')} />
          : null;
      case 'Dashboard':
      default:
        return isRecruiter
          ? <RecruiterDashboard setActivePage={setActivePage} user={user} />
          : <Dashboard 
              setActivePage={setActivePage} 
              isProfileComplete={isProfileComplete} 
              user={user}
              applications={applications}
              recommendations={recommendations}
            />;
    }
  };

  return (
    <div className="app-container">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activePage={activePage} 
        setActivePage={setActivePage}
        openAssistant={() => setAssistantOpen(true)}
        user={user}
        onLogout={onLogout}
      />
      <main className="main-content">
        {renderPage()}
      </main>
      {isAssistantOpen && <AIAssistantModal onClose={() => setAssistantOpen(false)} />}
    </div>
  );
}
```

### 8. Add Internship Service Methods

**File:** `src/services/internshipService.js`

```javascript
// Get recruiter's postings
export const getMyPostings = async () => {
  try {
    const response = await api.get('/internships/my-postings/all');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch postings' };
  }
};

// Get recruiter stats
export const getRecruiterStats = async () => {
  try {
    const response = await api.get('/internships/recruiter-stats/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch stats' };
  }
};

// Create new internship
export const createInternship = async (internshipData) => {
  try {
    const response = await api.post('/internships', internshipData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create internship' };
  }
};

// Get applications for an internship
export const getInternshipApplications = async (internshipId) => {
  try {
    const response = await api.get(`/internships/${internshipId}/applications`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch applications' };
  }
};
```

## CSS Additions Needed

```css
/* Role Selection Styles */
.role-selection {
  margin: 1.5rem 0;
}

.role-selection label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-dark);
}

.role-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.role-option {
  cursor: pointer;
}

.role-option input[type="radio"] {
  display: none;
}

.role-card {
  border: 2px solid var(--sidebar-border);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s;
}

.role-option.selected .role-card {
  border-color: var(--primary-blue);
  background-color: #E0E7FF;
}

.role-card svg {
  color: var(--primary-blue);
  margin-bottom: 0.5rem;
}

.role-card h4 {
  margin: 0.5rem 0 0.25rem 0;
  color: var(--text-dark);
}

.role-card p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-medium);
}

/* Sidebar Footer */
.sidebar-footer {
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid var(--sidebar-border);
}

.language-selector,
.notifications-btn {
  width: 100%;
  margin-bottom: 0.5rem;
}

.language-selector button,
.notifications-btn {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--sidebar-border);
  border-radius: 8px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.lang-dropdown {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--sidebar-border);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.lang-dropdown div {
  padding: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
}

.lang-dropdown div:hover {
  background: var(--tag-background);
}
```

## Testing Steps

1. **Reseed Database:**
   ```bash
   cd backend
   node seeder.js -d
   node seeder.js -i
   npm run dev
   ```

2. **Test Recruiter Signup:**
   - Go to signup page
   - Select "Recruiter" role
   - Fill in details and submit
   - Should see Recruiter Dashboard

3. **Test Recruiter Dashboard:**
   - Login as recruiter@example.com / password123
   - Should see stats and postings
   - "Post Internship" button should be visible

4. **Test Intern Dashboard:**
   - Login as aman@example.com / password
   - Should see "Find Internships" button
   - Should see AI recommendations

5. **Test Time-Based Greeting:**
   - Check greeting changes based on time of day

6. **Test Language Switching:**
   - Switch to Telugu - UI should update
   - Switch to Gujarati - UI should update
   - All text should be translated

7. **Test Post Internship:**
   - As recruiter, click "Post Internship"
   - Fill form and submit
   - Should appear in "My Postings"

## Summary

### Backend ✅ Complete
- User model updated with role field
- Auth controller accepts role during registration
- New recruiter endpoints created
- Routes updated with proper authorization
- Seeder updated with recruiter user

### Frontend 🔄 In Progress
- Need to add full translations for Telugu and Gujarati
- Need to implement time-aware greeting
- Need to update sidebar with language switcher and notifications
- Need to add role selection to signup page
- Need to create Recruiter Dashboard component
- Need to create Post Internship form
- Need to update main app routing logic
- Need to add new service methods

All backend changes are complete and tested. Frontend changes require systematic updates to App.js and related components.
