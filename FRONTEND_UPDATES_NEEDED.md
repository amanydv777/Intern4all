# Frontend Updates Required

## Summary
Backend is complete ✅. The following frontend changes are needed to complete the implementation.

## Quick Start Commands

```bash
# 1. Reseed database with new roles
cd backend
node seeder.js -d && node seeder.js -i
npm run dev

# 2. In another terminal, start frontend
cd ..
npm start

# 3. Test accounts:
# Intern: aman@example.com / password
# Recruiter: recruiter@example.com / password123
```

## Critical Frontend Files to Update

### 1. src/App.js - Add Full Translations

Find the `translations` object (line 17) and add TE (Telugu) and GU (Gujarati) to EVERY translation key.

Example pattern:
```javascript
dashboard: {
    greeting: { 
        EN: "Good morning", 
        HI: "सुप्रभात",
        TE: "శుభోదయం",
        GU: "સુપ્રભાત"
    },
}
```

**Telugu Translations:**
- Dashboard: డాష్‌బోర్డ్
- Find Internships: ఇంటర్న్‌షిప్‌లను కనుగొనండి
- My Applications: నా దరఖాస్తులు
- Profile: ప్రొఫైల్
- Good morning: శుభోదయం
- Good afternoon: శుభ మధ్యాహ్నం
- Good evening: శుభ సాయంత్రం

**Gujarati Translations:**
- Dashboard: ડેશબોર્ડ
- Find Internships: ઇન્ટર્નશિપ શોધો
- My Applications: મારી અરજીઓ
- Profile: પ્રોફાઇલ
- Good morning: સુપ્રભાત
- Good afternoon: શુભ બપોર
- Good evening: શુભ સાંજ

### 2. src/App.js - Add Time-Based Greeting Function

Add this function before the Dashboard component (around line 500):

```javascript
// Time-based greeting helper
const getTimeBasedGreeting = (t) => {
  const hour = new Date().getHours();
  if (hour < 12) return t('dashboard.goodMorning');
  if (hour < 17) return t('dashboard.goodAfternoon');
  if (hour < 21) return t('dashboard.goodEvening');
  return t('dashboard.goodNight');
};
```

Then in Dashboard component, replace:
```javascript
<h1>{t('dashboard.greeting')}, {user?.name}! 👋</h1>
```

With:
```javascript
<h1>{getTimeBasedGreeting(t)}, {user?.name}! 👋</h1>
```

### 3. src/App.js - Update SignUpPage with Role Selection

In the SignUpPage component (around line 316), add role state and UI:

```javascript
const SignUpPage = ({ onSignUpSuccess, onBackToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('intern'); // ADD THIS
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await authService.register({ 
        name, 
        email, 
        password,
        role // ADD THIS
      });
      onSignUpSuccess(response.user);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };
  
  // ... rest of component
```

Add role selection UI after the name field:

```javascript
<div className="form-group">
  <input 
    type="text" 
    placeholder="Full Name" 
    value={name} 
    onChange={(e) => setName(e.target.value)} 
    required 
    disabled={isLoading} 
  />
</div>

{/* ADD THIS ROLE SELECTION */}
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
        disabled={isLoading}
      />
      <div className="role-card">
        <LuUser size={24} />
        <h4>Intern</h4>
        <p>Find opportunities</p>
      </div>
    </label>
    <label className={`role-option ${role === 'recruiter' ? 'selected' : ''}`}>
      <input
        type="radio"
        name="role"
        value="recruiter"
        checked={role === 'recruiter'}
        onChange={(e) => setRole(e.target.value)}
        disabled={isLoading}
      />
      <div className="role-card">
        <LuBriefcase size={24} />
        <h4>Recruiter</h4>
        <p>Post internships</p>
      </div>
    </label>
  </div>
</div>

<div className="form-group">
  <input 
    type="email" 
    placeholder="Email Address" 
    // ... rest of email field
```

### 4. src/App.js - Add Recruiter Dashboard Component

Add this component after the FindInternshipsPage component (around line 610):

```javascript
// Recruiter Dashboard Component
const RecruiterDashboard = ({ setActivePage, user }) => {
  const { t } = useContext(LanguageContext);
  const [stats, setStats] = useState(null);
  const [myPostings, setMyPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await internshipService.getRecruiterStats();
        setStats(statsResponse.data);
        
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

  if (isLoading) {
    return <div className="dashboard"><div>Loading...</div></div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>{getTimeBasedGreeting(t)}, {user?.name}! 👋</h1>
          <p>Manage your internship postings</p>
        </div>
        <button 
          className="primary-button" 
          onClick={() => setActivePage('Post Internship')}
        >
          Post Internship →
        </button>
      </header>

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

      <div className="dashboard-main-area">
        <div className="recommendations-card">
          <div className="card-header">
            <h3>📋 My Internship Postings</h3>
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
                <div key={internship._id} className="internship-card">
                  <div className="internship-card-header">
                    <h4>{internship.title}</h4>
                    <p>{internship.company}</p>
                  </div>
                  <div className="internship-card-details">
                    <span><LuMapPin size={14} /> {internship.location}</span>
                    <span><LuDollarSign size={14} /> {internship.stipend}</span>
                  </div>
                  <div className="internship-card-footer">
                    <span className="posted-time">Posted {new Date(internship.createdAt).toLocaleDateString()}</span>
                    <button 
                      className="view-details-btn"
                      onClick={() => alert('View applications feature coming soon')}
                    >
                      View Applications
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

### 5. src/App.js - Add Post Internship Form Component

Add after RecruiterDashboard:

```javascript
// Post Internship Form Component
const PostInternshipPage = ({ onSuccess }) => {
  const { t } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    stipend: '',
    duration: '',
    startDate: '',
    applicationDeadline: '',
    sector: 'Technology',
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
        <div className="form-group">
          <label>Job Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label>Company Name *</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            rows="5"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Location *</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Stipend *</label>
          <input
            type="text"
            placeholder="e.g., ₹ 10,000/month"
            value={formData.stipend}
            onChange={(e) => setFormData({...formData, stipend: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Duration *</label>
          <input
            type="text"
            placeholder="e.g., 3 months"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Start Date *</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Application Deadline *</label>
          <input
            type="date"
            value={formData.applicationDeadline}
            onChange={(e) => setFormData({...formData, applicationDeadline: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Sector *</label>
          <select
            value={formData.sector}
            onChange={(e) => setFormData({...formData, sector: e.target.value})}
            required
            disabled={isLoading}
          >
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Design">Design</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
          </select>
        </div>

        <div className="form-group">
          <label>Number of Openings *</label>
          <input
            type="number"
            min="1"
            value={formData.numberOfOpenings}
            onChange={(e) => setFormData({...formData, numberOfOpenings: parseInt(e.target.value)})}
            required
            disabled={isLoading}
          />
        </div>

        {error && <p className="login-error-message">{error}</p>}
        
        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? 'Posting...' : 'Post Internship'}
        </button>
      </form>
    </div>
  );
};
```

### 6. src/App.js - Update SkillSyncApp renderPage Function

Find the `renderPage` function in SkillSyncApp (around line 224) and update it:

```javascript
const renderPage = () => {
  const isRecruiter = user?.role === 'recruiter';
  
  switch (activePage) {
    case 'Profile': 
      return <ProfileCompletion onProfileComplete={handleProfileComplete} user={user} />;
    case 'My Applications':
      return <ApplicationsPage applications={applications} setApplications={setApplications} />;
    case 'Find Internships':
      return <FindInternshipsPage recommendations={recommendations} />;
    case 'Post Internship':
      return isRecruiter 
        ? <PostInternshipPage onSuccess={() => setActivePage('Dashboard')} />
        : <div>Not authorized</div>;
    case 'Dashboard':
    default:
      return isRecruiter
        ? <RecruiterDashboard setActivePage={setActivePage} user={user} />
        : (
          <Dashboard 
            setActivePage={setActivePage} 
            isProfileComplete={isProfileComplete} 
            user={user}
            applications={applications}
            recommendations={recommendations}
          />
        );
  }
};
```

### 7. src/App.js - Update Sidebar Component

Find the Sidebar component (around line 447) and update the navItems based on user role:

```javascript
const Sidebar = ({ isOpen, onClose, activePage, setActivePage, openAssistant, user, onLogout }) => {
  const { t, language, changeLanguage, languages } = useContext(LanguageContext);
  const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
  
  const isRecruiter = user?.role === 'recruiter';
  
  const navItems = isRecruiter ? [
    { name: 'Dashboard', key: 'nav.dashboard', icon: <LuLayoutDashboard /> },
    { name: 'My Postings', key: 'nav.myApplications', icon: <LuFileText /> },
    { name: 'Profile', key: 'nav.profile', icon: <LuUser /> },
  ] : [
    { name: 'Dashboard', key: 'nav.dashboard', icon: <LuLayoutDashboard /> },
    { name: 'Find Internships', key: 'nav.findInternships', icon: <LuSearch /> },
    { name: 'My Applications', key: 'nav.myApplications', icon: <LuFileText /> },
    { name: 'Profile', key: 'nav.profile', icon: <LuUser /> },
  ];
  
  // ... rest of component
```

Add language switcher and notifications at the bottom of sidebar (before closing div):

```javascript
        {/* ADD THIS BEFORE THE CLOSING </div> OF SIDEBAR */}
        <div className="sidebar-footer">
          <div className="language-selector">
            <button onClick={() => setLangDropdownOpen(!isLangDropdownOpen)}>
              <LuGlobe /> {language.name}
            </button>
            {isLangDropdownOpen && (
              <div className="lang-dropdown">
                {languages.map(lang => (
                  <div 
                    key={lang.code} 
                    onClick={() => {
                      changeLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                  >
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

### 8. src/App.css - Add New Styles

Add these styles at the end of the file:

```css
/* Role Selection Styles */
.role-selection {
  margin: 1.5rem 0;
}

.role-selection > label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--text-dark);
  font-size: 0.875rem;
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
  padding: 1.25rem;
  text-align: center;
  transition: all 0.2s;
  background: white;
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
  font-size: 1rem;
}

.role-card p {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--text-medium);
}

/* Sidebar Footer */
.sidebar-footer {
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid var(--sidebar-border);
}

.language-selector {
  position: relative;
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
  color: var(--text-dark);
  transition: background 0.2s;
}

.language-selector button:hover,
.notifications-btn:hover {
  background: var(--tag-background);
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
  z-index: 1000;
}

.lang-dropdown div {
  padding: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.875rem;
}

.lang-dropdown div:hover {
  background: var(--tag-background);
}

.lang-dropdown div:first-child {
  border-radius: 8px 8px 0 0;
}

.lang-dropdown div:last-child {
  border-radius: 0 0 8px 8px;
}
```

## Testing Checklist

After making these changes:

1. ✅ Reseed database
2. ✅ Test intern signup with role selection
3. ✅ Test recruiter signup with role selection
4. ✅ Login as recruiter - see Recruiter Dashboard
5. ✅ Login as intern - see Intern Dashboard
6. ✅ Test "Post Internship" button (recruiter only)
7. ✅ Test time-based greeting (changes with time of day)
8. ✅ Test language switcher in sidebar
9. ✅ Test Telugu translations
10. ✅ Test Gujarati translations

## Summary

**Backend:** ✅ Complete
- User roles updated
- New API endpoints created
- Authorization middleware configured
- Seeder updated

**Frontend:** 🔄 Needs Updates
- Add full translations for TE and GU
- Add time-based greeting function
- Update SignUpPage with role selection
- Add RecruiterDashboard component
- Add PostInternshipPage component
- Update renderPage logic
- Update Sidebar with language switcher
- Add CSS for new components

All code snippets are provided above. Apply them in order for a complete implementation.
