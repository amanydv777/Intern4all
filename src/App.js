import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import './App.css';
import './LoginPage.css';
import {
  LuLayoutDashboard, LuSearch, LuFileText, LuBookOpen, LuUser, LuMessageSquare,
  LuBell, LuGlobe, LuPlus, LuBriefcase, LuTrendingUp, LuTarget, LuFilePlus,
  LuCircleCheck, LuCircle, LuBuilding2, LuX, LuMapPin, LuDollarSign,
  LuBot, LuSend, LuCircleUserRound, LuMenu, LuHistory
} from 'react-icons/lu';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as authService from './services/authService';
import * as userService from './services/userService';
import * as internshipService from './services/internshipService';
import * as applicationService from './services/applicationService';

// --- Translation Data ---
const translations = {
    nav: {
        dashboard: { EN: "Dashboard", HI: "डैशबोर्ड", TE: "డాష్‌బోర్డ్", GU: "ડેશબોર્ડ" },
        findInternships: { EN: "Find Internships", HI: "इंटर्नशिप खोजें", TE: "ఇంటర్న్‌షిప్‌లను కనుగొనండి", GU: "ઇન્ટર્નશિપ શોધો" },
        myApplications: { EN: "My Applications", HI: "मेरे आवेदन", TE: "నా దరఖాస్తులు", GU: "મારી અરજીઓ" },
        prepCourses: { EN: "Prep Courses", HI: "तैयारी पाठ्यक्रम" },
        profile: { EN: "Profile", HI: "प्रोफ़ाइल", TE: "ప్రొఫైల్", GU: "પ્રોફાઇલ" },
        navigation: { EN: "Navigation", HI: "नेविगेशन" },
        quickHelp: { EN: "Quick Help", HI: "त्वरित सहायता" },
        askAssistant: { EN: "Ask Assistant", HI: "सहायक से पूछें" },
    },
    dashboard: {
        goodMorning: { EN: "Good morning", HI: "सुप्रभात", TE: "శుభోదయం", GU: "સુપ્રભાત" },
        goodAfternoon: { EN: "Good afternoon", HI: "नमस्ते", TE: "శుభ మధ్యాహ్నం", GU: "શુભ બપોર" },
        goodEvening: { EN: "Good evening", HI: "शुभ संध्या", TE: "శుభ సాయంత్రం", GU: "શુભ સાંજ" },
        goodNight: { EN: "Good night", HI: "शुभ रात्रि", TE: "శుభ రాత్రి", GU: "શુભ રાત્રિ" },
        ready: { EN: "Ready to explore new opportunities?", HI: "नए अवसर तलाशने के लिए तैयार हैं?", TE: "కొత్త అవకాశాలను అన్వేషించడానికి సిద్ధంగా ఉన్నారా?", GU: "નવી તકો શોધવા માટે તૈયાર છો?" },
        findBtn: { EN: "Find Internships", HI: "इंटर्नशिप खोजें", TE: "ఇంటర్న్‌షిప్‌లను కనుగొనండి", GU: "ઇન્ટર્નશિપ શોધો" },
        postBtn: { EN: "Post Internship", HI: "इंटर्नशिप पोस्ट करें", TE: "ఇంటర్న్‌షిప్ పోస్ట్ చేయండి", GU: "ઇન્ટર્નશિપ પોસ્ટ કરો" },
        activeApps: { EN: "Active Applications", HI: "सक्रिय आवेदन" },
        aiMatches: { EN: "AI Matches", HI: "एआई मैच" },
        successRate: { EN: "Success Rate", HI: "सफलता दर" },
        totalApplied: { EN: "total applied", HI: "कुल आवेदन" },
        personalized: { EN: "Personalized for you", HI: "आपके लिए वैयक्तिकृत" },
        basedOnApps: { EN: "Based on applications", HI: "आवेदनों पर आधारित" },
        aiRecommended: { EN: "AI-Recommended For You", HI: "एआई-अनुशंसित आपके लिए" },
        viewAll: { EN: "View All", HI: "सभी देखें" },
        completeProfilePrompt: { EN: "Complete your profile for AI recommendations", HI: "एआई सिफारिशों के लिए अपनी प्रोफ़ाइल पूरी करें" },
        completeProfileSubtext: { EN: "Help us understand your skills and preferences to show personalized matches", HI: "व्यक्तिगत मैच दिखाने के लिए हमें अपने कौशल और प्राथमिकताएं समझने में मदद करें" },
        completeProfileBtn: { EN: "Complete Profile", HI: "प्रोफ़ाइल पूरी करें" },
        yourProgress: { EN: "Your Progress", HI: "आपकी प्रगति" },
        progress: {
            complete: { title: { EN: "Complete Profile", HI: "प्रोफ़ाइल पूरी करें" }, subtitle: { EN: "Add your skills, preferences, and education details", HI: "अपने कौशल, प्राथमिकताएं और शिक्षा विवरण जोड़ें" } },
            explore: { title: { EN: "Explore Internships", HI: "इंटर्नशिप खोजें" }, subtitle: { EN: "Browse and find opportunities that match your goals", HI: "अपने लक्ष्यों से मेल खाने वाले अवसर ब्राउज़ करें और खोजें" } },
            submit: { title: { EN: "Submit Applications", HI: "आवेदन जमा करें" }, subtitle: { EN: "Apply to internships you're interested in", HI: "जिन इंटर्नशिप में आपकी रुचि है, उनके लिए आवेदन करें" } },
            develop: { title: { EN: "Skill Development", HI: "कौशल विकास" }, subtitle: { EN: "Take courses to improve your chances", HI: "अपने अवसरों को बेहतर बनाने के लिए पाठ्यक्रम लें" } },
        }
    },
    profile: {
        title: { EN: "Update Your Profile", HI: "अपनी प्रोफ़ाइल अपडेट करें" },
        subtitle: { EN: "Help us find the perfect internship matches for you", HI: "हमें आपके लिए सही इंटर्नशिप मैच खोजने में मदद करें" },
        basicInfo: { EN: "Basic Info", HI: "मूल जानकारी" },
        skillsInterests: { EN: "Skills & Interests", HI: "कौशल और रुचियाँ" },
        preferences: { EN: "Preferences", HI: "प्राथमिकताएँ" },
        phone: { EN: "Phone Number", HI: "फ़ोन नंबर" },
        location: { EN: "Current Location", HI: "वर्तमान स्थान" },
        education: { EN: "Education Level", HI: "शिक्षा स्तर" },
        studyField: { EN: "Field of Study", HI: "अध्ययन का क्षेत्र" },
        yourSkills: { EN: "Your Skills", HI: "आपके कौशल" },
        popularSkills: { EN: "Popular Skills:", HI: "लोकप्रिय कौशल:" },
        preferredSectors: { EN: "Preferred Sectors", HI: "पसंदीदा क्षेत्र" },
        chooseIndustries: { EN: "Choose industries you're interested in", HI: "जिन उद्योगों में आपकी रुचि है, उन्हें चुनें" },
        yourSectors: { EN: "Your Sectors:", HI: "आपके क्षेत्र:" },
        workPreferences: { EN: "Work Preferences", HI: "कार्य प्राथमिकताएँ" },
        preferredLocations: { EN: "Preferred Work Locations", HI: "पसंदीदा कार्य स्थान" },
        whenStart: { EN: "When can you start?", HI: "आप कब शुरू कर सकते हैं?" },
        backBtn: { EN: "Back", HI: "वापस" },
        nextBtn: { EN: "Next:", HI: "अगला:" },
    },
    aiAssistant: {
        title: { EN: "AI Assistant", HI: "एआई सहायक" },
        subtitle: { EN: "Here to help you succeed", HI: "आपकी सफलता में मदद के लिए यहाँ है" },
        greeting: { EN: "Hello! I'm your AI assistant. How can I help you today?", HI: "नमस्ते! मैं आपका एआई सहायक हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?" },
        quickQuestions: { EN: "Quick questions:", HI: "त्वरित प्रश्न:" },
        q1: { EN: "How do I apply for internships?", HI: "मैं इंटर्नशिप के लिए कैसे आवेदन करूं?" },
        q2: { EN: "What skills do I need?", HI: "मुझे किन कौशलों की आवश्यकता है?" },
        q3: { EN: "How to track my applications?", HI: "मैं अपने आवेदनों को कैसे ट्रैक करूं?" },
        contactSupport: { EN: "Contact support team", HI: "सहायता टीम से संपर्क करें" },
        inputPlaceholder: { EN: "Type your message...", HI: "अपना संदेश लिखें..." },
    },
    internshipCard: {
        posted: { EN: "Posted 2 days ago", HI: "2 दिन पहले पोस्ट किया गया" },
        viewDetails: { EN: "View Details", HI: "विवरण देखें" },
    }
};

const languages = [
    { code: 'EN', name: 'English'}, { code: 'HI', name: 'हिन्दी'}, { code: 'TE', name: 'తెలుగు'}, { code: 'GU', name: 'ગુજરાતી'},
];

// --- Language Context and Provider ---
const LanguageContext = createContext();
const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(languages[0]);
    const changeLanguage = (langCode) => { const newLang = languages.find(l => l.code === langCode) || languages[0]; setLanguage(newLang); };
    const t = (key) => { const keys = key.split('.'); let result = translations; for (const k of keys) { result = result[k]; if (!result) return key; } return result[language.code] || result['EN']; };
    return (<LanguageContext.Provider value={{ language, changeLanguage, t, languages }}>{children}</LanguageContext.Provider>);
};

// --- App Component (Handles Login State) ---
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const response = await authService.getCurrentUser();
          setCurrentUser(response.data);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          authService.logout();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const [authPage, setAuthPage] = useState('login'); // 'login', 'signup', 'forgot', 'reset'
  const [resetToken, setResetToken] = useState(null);

  const handleSignUpClick = () => {
    setAuthPage('signup');
  };

  const handleBackToLogin = () => {
    setAuthPage('login');
  };

  const handleForgotPasswordClick = () => {
    setAuthPage('forgot');
  };

  const handleResetPassword = (token) => {
    setResetToken(token);
    setAuthPage('reset');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      {isLoggedIn && currentUser ? (
        <SkillSyncApp user={currentUser} onLogout={handleLogout} onUserUpdate={setCurrentUser} />
      ) : authPage === 'signup' ? (
        <SignUpPage onSignUpSuccess={handleLoginSuccess} onBackToLogin={handleBackToLogin} />
      ) : authPage === 'forgot' ? (
        <ForgotPasswordPage onBackToLogin={handleBackToLogin} />
      ) : authPage === 'reset' ? (
        <ResetPasswordPage resetToken={resetToken} onSuccess={handleLoginSuccess} onBackToLogin={handleBackToLogin} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} onSignUpClick={handleSignUpClick} onForgotPasswordClick={handleForgotPasswordClick} />
      )}
    </LanguageProvider>
  );
}

// --- Main Application Component ---
function SkillSyncApp({ user, onLogout, onUserUpdate }) {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(user?.profile?.isComplete || false);
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedInternshipId, setSelectedInternshipId] = useState(null);

  useEffect(() => {
    setIsProfileComplete(user?.profile?.isComplete || false);
  }, [user]);

  useEffect(() => {
    // Fetch user applications
    const fetchApplications = async () => {
      try {
        const response = await applicationService.getMyApplications();
        setApplications(response.data);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      }
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    // Fetch recommendations if profile is complete
    const fetchRecommendations = async () => {
      if (isProfileComplete) {
        try {
          const response = await internshipService.getRecommendations();
          setRecommendations(response.data);
        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
        }
      }
    };
    fetchRecommendations();
  }, [isProfileComplete]);

  const handleProfileComplete = async () => {
    try {
      const response = await authService.getCurrentUser();
      onUserUpdate(response.data);
      setIsProfileComplete(response.data.profile.isComplete);
      setActivePage('Dashboard');
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const handleInternshipClick = (internshipId) => {
    setSelectedInternshipId(internshipId);
    setActivePage('Internship Detail');
  };

  const handleViewApplications = (internshipId) => {
    setSelectedInternshipId(internshipId);
    setActivePage('View Applications');
  };

  const renderPage = () => {
    const isRecruiter = user?.role === 'recruiter';
    
    switch (activePage) {
      case 'Profile': 
        return <ProfileCompletion onProfileComplete={handleProfileComplete} user={user} />;
      case 'My Applications':
        return <ApplicationsPage applications={applications} setApplications={setApplications} />;
      case 'Find Internships':
        return <FindInternshipsPage recommendations={recommendations} onInternshipClick={handleInternshipClick} />;
      case 'Post Internship':
        return isRecruiter 
          ? <PostInternshipPage onSuccess={() => setActivePage('Dashboard')} />
          : <div>Not authorized</div>;
      case 'Internship Detail':
        return <InternshipDetailPage 
          internshipId={selectedInternshipId}
          user={user}
          onBack={() => setActivePage('Find Internships')}
        />;
      case 'View Applications':
        return <ViewApplicationsPage 
          internshipId={selectedInternshipId}
          onBack={() => setActivePage('Dashboard')}
        />;
      case 'Dashboard':
      default:
        return isRecruiter
          ? <RecruiterDashboard setActivePage={setActivePage} user={user} onViewApplications={handleViewApplications} />
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

// --- Login Page Component ---
const LoginPage = ({ onLoginSuccess, onSignUpClick, onForgotPasswordClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authService.login({ email, password });
      onLoginSuccess(response.user);
    } catch (err) {
      setError(err.message || 'Invalid credentials. Try: aman@example.com / password');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-logo"><span className="header-logo">PM</span></div>
        <h2 className="login-title">Welcome to Intern4All</h2>
        <p className="login-subtitle">Sign in to continue</p>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group"><input type="text" placeholder="Email or Username" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} /></div>
          <div className="form-group"><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} /></div>
          {error && <p className="login-error-message">{error}</p>}
          <button type="submit" className="signin-btn" disabled={isLoading}>{isLoading ? 'Signing In...' : 'Sign In'}</button>
        </form>
        <div className="login-links">
          <a href="#" onClick={(e) => {e.preventDefault(); onForgotPasswordClick();}}>Forgot password?</a>
          <span> • </span>
          <a href="#" onClick={(e) => {e.preventDefault(); onSignUpClick();}}>Need an account? Sign up</a>
        </div>
      </div>
    </div>
  );
};

// --- Sign Up Page Component ---
const SignUpPage = ({ onSignUpSuccess, onBackToLogin }) => {
  const [role, setRole] = useState('intern');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ... (rest of the code remains the same)
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await authService.register({ name, email, password, role });
      onSignUpSuccess(response.user);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-logo"><span className="header-logo">PM</span></div>
        <h2 className="login-title">Create Your Account</h2>
        <p className="login-subtitle">Join Intern4All today</p>
        <form onSubmit={handleSignUp} className="login-form">
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
                  <p>Find internships</p>
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
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={isLoading} 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Password (min 6 characters)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={isLoading} 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              disabled={isLoading} 
            />
          </div>
          {error && <p className="login-error-message">{error}</p>}
          <button type="submit" className="signin-btn" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="login-links">
          <a href="#" onClick={(e) => {e.preventDefault(); onBackToLogin();}}>Already have an account? Sign in</a>
        </div>
      </div>
    </div>
  );
};

// --- Forgot Password Page Component ---
const ForgotPasswordPage = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.forgotPassword(email);
      setSuccess('Password reset instructions have been sent to your email. Check the console for the reset link (development only).');
      console.log('Reset URL:', response.resetUrl);
      console.log('Reset Token:', response.resetToken);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-logo"><span className="header-logo">PM</span></div>
        <h2 className="login-title">Forgot Password?</h2>
        <p className="login-subtitle">Enter your email to reset your password</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={isLoading} 
            />
          </div>
          {error && <p className="login-error-message">{error}</p>}
          {success && <p className="login-success-message">{success}</p>}
          <button type="submit" className="signin-btn" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <div className="login-links">
          <a href="#" onClick={(e) => {e.preventDefault(); onBackToLogin();}}>Back to Sign In</a>
        </div>
      </div>
    </div>
  );
};

// --- Reset Password Page Component ---
const ResetPasswordPage = ({ resetToken, onSuccess, onBackToLogin }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
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
      const response = await authService.resetPassword(resetToken, password);
      onSuccess(response.user);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-logo"><span className="header-logo">PM</span></div>
        <h2 className="login-title">Reset Password</h2>
        <p className="login-subtitle">Enter your new password</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input 
              type="password" 
              placeholder="New Password (min 6 characters)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={isLoading} 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              disabled={isLoading} 
            />
          </div>
          {error && <p className="login-error-message">{error}</p>}
          <button type="submit" className="signin-btn" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <div className="login-links">
          <a href="#" onClick={(e) => {e.preventDefault(); onBackToLogin();}}>Back to Sign In</a>
        </div>
      </div>
    </div>
  );
};

// --- Mobile Header Component ---
const MobileHeader = ({ onMenuClick }) => {
    const { language, changeLanguage, languages } = useContext(LanguageContext);
    const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
    const langDropdownRef = useRef(null);

    useEffect(() => { const handleClickOutside = (event) => { if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) { setLangDropdownOpen(false); } }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [langDropdownRef]);
    
    return (
        <header className="mobile-header">
            <button className="icon-button" onClick={onMenuClick}><LuMenu /></button>
            <div className="header-logo-section">
                <span className="header-logo">PM</span>
                <span className="header-title">PM Internships</span>
            </div>
            <div className="header-controls">
                <div className="language-selector-wrapper" ref={langDropdownRef}>
                    <button className="icon-button" onClick={() => setLangDropdownOpen(!isLangDropdownOpen)}>
                        <LuGlobe/>
                    </button>
                    {isLangDropdownOpen && (<div className="language-dropdown">{languages.map(lang => (<div key={lang.code} className="dropdown-item" onClick={() => { changeLanguage(lang.code); setLangDropdownOpen(false); }}><span className="lang-code">{lang.code}</span> {lang.name}</div>))}</div>)}
                </div>
                <button className="icon-button"><LuBell/></button>
            </div>
        </header>
    );
};

// Sidebar Component
const Sidebar = ({ isOpen, onClose, activePage, setActivePage, openAssistant, user, onLogout }) => {
  const { t, language, changeLanguage, languages } = useContext(LanguageContext);
  const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
  
  const isRecruiter = user?.role === 'recruiter';
  
  const navItems = isRecruiter ? [
    { name: 'Dashboard', key: 'nav.dashboard', icon: <LuLayoutDashboard /> },
    { name: 'My Applications', key: 'nav.myApplications', icon: <LuFileText /> },
    { name: 'Profile', key: 'nav.profile', icon: <LuUser /> },
  ] : [
    { name: 'Dashboard', key: 'nav.dashboard', icon: <LuLayoutDashboard /> },
    { name: 'Find Internships', key: 'nav.findInternships', icon: <LuSearch /> },
    { name: 'My Applications', key: 'nav.myApplications', icon: <LuFileText /> },
    { name: 'Profile', key: 'nav.profile', icon: <LuUser /> },
  ];
  
  const handleLinkClick = (pageName) => {
    setActivePage(pageName);
    onClose();
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
          <div>
            <div className="sidebar-header"><span className="sidebar-logo">PM</span><div><div className="sidebar-title">PM Internships</div><div className="sidebar-subtitle">Smart Career Matching</div></div></div>
            <nav className="sidebar-nav">
              <div className="sidebar-section-title">{t('nav.navigation')}</div>
              <ul>{navItems.map(item => (<li key={item.name}><button className={`nav-link ${activePage === item.name ? 'active' : ''}`} onClick={() => handleLinkClick(item.name)}>{item.icon} {t(item.key)}</button></li>))}</ul>
            </nav>
            <div className="sidebar-section-title">{t('nav.quickHelp')}</div>
            <nav className="sidebar-nav"><ul><li><button className="nav-link" onClick={() => {openAssistant(); onClose();}}><LuMessageSquare /> {t('nav.askAssistant')}</button></li></ul></nav>
          </div>
          
          <div style={{marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--sidebar-border)'}}>
            <div className="language-selector" style={{position: 'relative', marginBottom: '0.5rem'}}>
              <button 
                onClick={() => setLangDropdownOpen(!isLangDropdownOpen)}
                style={{width: '100%', padding: '0.75rem', border: '1px solid var(--sidebar-border)', borderRadius: '8px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}
              >
                <LuGlobe /> {language.name}
              </button>
              {isLangDropdownOpen && (
                <div className="lang-dropdown" style={{position: 'absolute', bottom: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--sidebar-border)', borderRadius: '8px', marginBottom: '0.5rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', zIndex: 1000}}>
                  {languages.map(lang => (
                    <div 
                      key={lang.code} 
                      onClick={() => {
                        changeLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      style={{padding: '0.75rem', cursor: 'pointer', fontSize: '0.875rem'}}
                    >
                      {lang.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button 
              className="notifications-btn"
              style={{width: '100%', padding: '0.75rem', border: '1px solid var(--sidebar-border)', borderRadius: '8px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}
            >
              <LuBell /> Notifications
            </button>
          </div>
          
          <div className="sidebar-footer">
            <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
            <div>
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">{user?.role === 'admin' ? 'Admin' : user?.role === 'recruiter' ? 'Recruiter' : 'Intern'}</div>
            </div>
            <button onClick={onLogout} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }} title="Logout">⎋</button>
          </div>
        </div>
      </aside>
    </>
  );
};

// --- THIS IS THE MISSING COMPONENT THAT WAS ADDED BACK ---
// Internship Card Component
const InternshipCard = ({ internship, onClick }) => {
    const { t } = useContext(LanguageContext);
    return (
        <div className="internship-card"><div className="internship-card-header"><h4>{internship.title}</h4><p>{internship.company}</p></div><div className="internship-card-details"><span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><LuMapPin size={14} /> {internship.location}</span><span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><LuDollarSign size={14} /> {internship.stipend}</span></div><div className="internship-card-tags">{internship.tags?.map(tag => <span key={tag} className="internship-tag">{tag}</span>)}</div><div className="internship-card-footer"><span className="posted-time">{t('internshipCard.posted')}</span><button className="view-details-btn" onClick={() => onClick && onClick(internship._id)}>{t('internshipCard.viewDetails')}</button></div></div>
    )
}

// Time-based greeting helper
const getTimeBasedGreeting = (t) => {
  const hour = new Date().getHours();
  if (hour < 12) return t('dashboard.goodMorning');
  if (hour < 17) return t('dashboard.goodAfternoon');
  if (hour < 21) return t('dashboard.goodEvening');
  return t('dashboard.goodNight');
};

// Dashboard Component
const Dashboard = ({ setActivePage, isProfileComplete, user, applications, recommendations }) => {
  const { t } = useContext(LanguageContext);
  const activeApplications = applications.filter(app => app.status === 'pending' || app.status === 'reviewing');
  const totalApplications = applications.length;
  const successRate = totalApplications > 0 ? Math.round((applications.filter(app => app.status === 'accepted').length / totalApplications) * 100) : 0;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <span className="ai-badge">✨ AI-Powered Matching</span>
          <h1>{getTimeBasedGreeting(t)}, {user?.name}! 👋</h1>
          <p>{t('dashboard.ready')}</p>
        </div>
        <button className="primary-button" onClick={() => setActivePage('Find Internships')}>{t('dashboard.findBtn')} →</button>
      </header>
      <div className="stats-grid">
        <StatCard title={t('dashboard.activeApps')} value={activeApplications.length.toString()} footer={`${totalApplications} ${t('dashboard.totalApplied')}`} icon={<LuFilePlus />} iconClass="blue" />
        <StatCard title={t('dashboard.aiMatches')} value={isProfileComplete ? recommendations.length.toString() : "0"} footer={t('dashboard.personalized')} icon={<LuTarget />} iconClass="green" />
        <StatCard title={t('dashboard.successRate')} value={`${successRate}%`} footer={t('dashboard.basedOnApps')} icon={<LuTrendingUp />} iconClass="purple" />
      </div>
      <div className="dashboard-main-area">
        <div className="recommendations-card">
          <div className="card-header"><h3>✨ {t('dashboard.aiRecommended')}</h3><button className="view-all-link" onClick={() => setActivePage('Find Internships')}>{t('dashboard.viewAll')}</button></div>
          {!isProfileComplete ? (<div className="empty-state"><LuBuilding2 /><h4>{t('dashboard.completeProfilePrompt')}</h4><p>{t('dashboard.completeProfileSubtext')}</p><button className="dark-button" onClick={() => setActivePage('Profile')}>{t('dashboard.completeProfileBtn')}</button></div>) : recommendations.length > 0 ? (<div className="recommendations-grid">{recommendations.slice(0, 3).map((internship) => (<InternshipCard key={internship._id} internship={internship} />))}</div>) : (<div className="empty-state"><LuBuilding2 /><h4>No recommendations yet</h4><p>Check back later for personalized matches</p></div>)}
        </div>
        <div className="progress-card">
          <div className="card-header"><h3>{t('dashboard.yourProgress')}</h3><span>{isProfileComplete ? '4/4' : '1/4'}</span></div>
          <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: isProfileComplete ? '100%' : '25%' }}></div></div>
          <ul className="progress-checklist">
            <ChecklistItem title={t('dashboard.progress.complete.title')} subtitle={t('dashboard.progress.complete.subtitle')} completed={true} />
            <ChecklistItem title={t('dashboard.progress.explore.title')} subtitle={t('dashboard.progress.explore.subtitle')} completed={isProfileComplete} />
            <ChecklistItem title={t('dashboard.progress.submit.title')} subtitle={t('dashboard.progress.submit.subtitle')} completed={totalApplications > 0} />
            <ChecklistItem title={t('dashboard.progress.develop.title')} subtitle={t('dashboard.progress.develop.subtitle')} completed={isProfileComplete} />
          </ul>
          <div className="recent-activity-header card-header"><h3><LuHistory/> Recent Activity</h3></div>
           {applications.length > 0 ? (<ul style={{listStyle: 'none', padding: 0}}>{applications.slice(0, 3).map(app => (<li key={app._id} style={{padding: '0.5rem 0', fontSize: '0.875rem', color: 'var(--text-medium)'}}>Applied to {app.internship?.title || 'Internship'}</li>))}</ul>) : (<p style={{textAlign: 'center', color: 'var(--text-light)', marginTop: '1rem'}}>No recent activity.</p>)}
        </div>
      </div>
    </div>
  );
};

// StatCard Sub-component for Dashboard
const StatCard = ({ title, value, footer, icon, iconClass }) => (<div className="stat-card"><div className="stat-card-header"><span className="stat-card-title">{title}</span><div className={`stat-card-icon ${iconClass}`}>{icon}</div></div><div className="stat-card-value">{value}</div><div className="stat-card-footer">{footer}</div></div>);
const ChecklistItem = ({ title, subtitle, completed = false }) => (<li className="checklist-item"><div style={{flexShrink: 0}}>{completed ? <LuCircleCheck className="checklist-icon completed" /> : <LuCircle className="checklist-icon pending" />}</div><div><div className="checklist-item-title">{title}</div><div className="checklist-item-subtitle">{subtitle}</div>{!completed && <a href="#" onClick={(e) => e.preventDefault()} className="checklist-item-action">Complete →</a>}</div></li>);

// Applications Page Component
const ApplicationsPage = ({ applications, setApplications }) => {
  const { t } = useContext(LanguageContext);
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>{t('nav.myApplications')}</h1>
          <p>Track your internship applications</p>
        </div>
      </header>
      {applications.length === 0 ? (
        <div className="empty-state" style={{marginTop: '2rem'}}>
          <LuFileText size={48} />
          <h4>No applications yet</h4>
          <p>Start applying to internships to see them here</p>
        </div>
      ) : (
        <div style={{marginTop: '2rem'}}>
          {applications.map(app => (
            <div key={app._id} className="internship-card" style={{marginBottom: '1rem'}}>
              <div className="internship-card-header">
                <h4>{app.internship?.title || 'Internship'}</h4>
                <p>{app.internship?.company || 'Company'}</p>
              </div>
              <div className="internship-card-details">
                <span>Status: <strong>{app.status}</strong></span>
                <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                {app.aiMatchScore > 0 && <span>Match: {app.aiMatchScore}%</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Find Internships Page Component with Advanced Filters
const FindInternshipsPage = ({ recommendations, onInternshipClick }) => {
  const { t } = useContext(LanguageContext);
  const [internships, setInternships] = useState(recommendations);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    minStipend: '',
    maxStipend: '',
    locationType: [],
    duration: '',
    skills: []
  });

  useEffect(() => {
    setInternships(recommendations);
  }, [recommendations]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleLocationTypeToggle = (type) => {
    setFilters(prev => ({
      ...prev,
      locationType: prev.locationType.includes(type)
        ? prev.locationType.filter(t => t !== type)
        : [...prev.locationType, type]
    }));
  };

  const applyFilters = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.minStipend) queryParams.append('minStipend', filters.minStipend);
      if (filters.maxStipend) queryParams.append('maxStipend', filters.maxStipend);
      if (filters.locationType.length > 0) queryParams.append('locationType', filters.locationType.join(','));
      if (filters.duration) queryParams.append('duration', filters.duration);
      if (filters.skills.length > 0) queryParams.append('skills', filters.skills.join(','));

      const response = await internshipService.getInternships(queryParams.toString() ? `?${queryParams.toString()}` : '');
      setInternships(response.data);
    } catch (error) {
      console.error('Failed to fetch filtered internships:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      minStipend: '',
      maxStipend: '',
      locationType: [],
      duration: '',
      skills: []
    });
    setInternships(recommendations);
  };

  const activeFilterCount = Object.values(filters).filter(v => 
    Array.isArray(v) ? v.length > 0 : v !== ''
  ).length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>{t('nav.findInternships')}</h1>
          <p>Discover internship opportunities tailored for you</p>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar" style={{marginTop: '2rem'}}>
        <div className="search-input-wrapper">
          <LuSearch size={20} style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-medium)'}} />
          <input
            type="text"
            placeholder="Search by title, company, or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
            style={{paddingLeft: '3rem'}}
          />
        </div>
        <button 
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <LuSearch size={18} />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
        <button className="primary-button" onClick={applyFilters} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label className="filter-label">Stipend Range</label>
            <div className="stipend-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minStipend}
                onChange={(e) => handleFilterChange('minStipend', e.target.value)}
                className="filter-input"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxStipend}
                onChange={(e) => handleFilterChange('maxStipend', e.target.value)}
                className="filter-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Location Type</label>
            <div className="checkbox-group">
              {['Remote', 'On-site', 'Hybrid'].map(type => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.locationType.includes(type)}
                    onChange={() => handleLocationTypeToggle(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Duration</label>
            <select
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
              className="filter-select"
            >
              <option value="">Any Duration</option>
              <option value="1 month">1 month</option>
              <option value="2 months">2 months</option>
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
              <option value="12 months">12 months</option>
            </select>
          </div>

          <div className="filter-actions">
            <button className="secondary-button" onClick={clearFilters}>
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="loading-state" style={{marginTop: '2rem', textAlign: 'center'}}>
          <p>Loading internships...</p>
        </div>
      ) : internships.length === 0 ? (
        <div className="empty-state" style={{marginTop: '2rem'}}>
          <LuSearch size={48} />
          <h4>No internships found</h4>
          <p>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="internships-grid" style={{marginTop: '2rem'}}>
          {internships.map(internship => (
            <InternshipCard key={internship._id} internship={internship} onClick={onInternshipClick} />
          ))}
        </div>
      )}
    </div>
  );
};

// Recruiter Dashboard Component
const RecruiterDashboard = ({ setActivePage, user, onViewApplications }) => {
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
          {t('dashboard.postBtn')} →
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
                <div key={internship._id} className="internship-card clickable" onClick={() => onViewApplications(internship._id)}>
                  <div className="internship-card-header">
                    <h4>{internship.title}</h4>
                    <p>{internship.company}</p>
                  </div>
                  <div className="internship-card-details">
                    <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><LuMapPin size={14} /> {internship.location}</span>
                    <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><LuDollarSign size={14} /> {internship.stipend}</span>
                  </div>
                  <div className="internship-card-footer">
                    <span className="posted-time">Posted {new Date(internship.createdAt).toLocaleDateString()}</span>
                    <button 
                      className="view-details-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewApplications(internship._id);
                      }}
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

// Internship Detail Page Component
const InternshipDetailPage = ({ internshipId, user, onBack }) => {
  const [internship, setInternship] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const response = await internshipService.getInternship(internshipId);
        setInternship(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load internship');
      } finally {
        setIsLoading(false);
      }
    };
    if (internshipId) fetchInternship();
  }, [internshipId]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applicationService.createApplication(internshipId);
      alert('Application submitted successfully!');
      onBack();
    } catch (err) {
      alert(err.message || 'Failed to submit application');
      setApplying(false);
    }
  };

  if (isLoading) return <div className="dashboard"><div>Loading...</div></div>;
  if (error) return <div className="dashboard"><div>Error: {error}</div></div>;
  if (!internship) return <div className="dashboard"><div>Internship not found</div></div>;

  const isRecruiter = user?.role === 'recruiter';
  const isOwnPosting = isRecruiter && internship.postedBy === user?.id;

  return (
    <div className="internship-detail-page">
      <button onClick={onBack} className="back-button">← Back</button>
      
      <div className="internship-detail-header">
        <h1>{internship.title}</h1>
        <h2>{internship.company}</h2>
      </div>

      <div className="internship-detail-content">
        <div className="detail-section">
          <h3>Description</h3>
          <p>{internship.description}</p>
        </div>

        {internship.requirements && internship.requirements.length > 0 && (
          <div className="detail-section">
            <h3>Requirements</h3>
            <ul>
              {internship.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {internship.responsibilities && internship.responsibilities.length > 0 && (
          <div className="detail-section">
            <h3>Responsibilities</h3>
            <ul>
              {internship.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="detail-section">
          <h3>Details</h3>
          <div className="detail-grid">
            <div><strong>Location:</strong> {internship.location}</div>
            <div><strong>Stipend:</strong> {internship.stipend}</div>
            <div><strong>Duration:</strong> {internship.duration}</div>
            <div><strong>Start Date:</strong> {new Date(internship.startDate).toLocaleDateString()}</div>
            <div><strong>Deadline:</strong> {new Date(internship.applicationDeadline).toLocaleDateString()}</div>
            <div><strong>Openings:</strong> {internship.numberOfOpenings}</div>
          </div>
        </div>

        {!isRecruiter && !isOwnPosting && (
          <button 
            className="primary-button apply-button" 
            onClick={handleApply}
            disabled={applying}
          >
            {applying ? 'Applying...' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  );
};

// View Applications Page Component
const ViewApplicationsPage = ({ internshipId, onBack }) => {
  const [applications, setApplications] = useState([]);
  const [internship, setInternship] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsResponse, internshipResponse] = await Promise.all([
          internshipService.getInternshipApplications(internshipId),
          internshipService.getInternship(internshipId)
        ]);
        setApplications(appsResponse.data);
        setInternship(internshipResponse.data);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (internshipId) fetchData();
  }, [internshipId]);

  if (isLoading) return <div className="dashboard"><div>Loading...</div></div>;

  return (
    <div className="view-applications-page">
      <button onClick={onBack} className="back-button">← Back to Dashboard</button>
      
      <div className="page-header">
        <h1>Applications for {internship?.title}</h1>
        <p>{applications.length} total applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <LuFileText size={48} />
          <h3>No applications yet</h3>
          <p>Applications will appear here once candidates apply</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map(application => (
            <div key={application._id} className="application-card">
              <div className="applicant-info">
                <div className="applicant-avatar">
                  {application.applicant.name.charAt(0)}
                </div>
                <div>
                  <h3>{application.applicant.name}</h3>
                  <p>{application.applicant.email}</p>
                </div>
              </div>

              <div className="applicant-skills">
                <strong>Skills:</strong>
                <div className="skills-tags">
                  {application.applicant.profile?.skills?.slice(0, 5).map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="application-meta">
                <span className="ai-score">AI Match: {application.aiMatchScore}%</span>
                <span className="application-date">
                  Applied {new Date(application.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="application-status">
                <span className={`status-badge status-${application.status}`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- THIS IS THE MISSING COMPONENT THAT WAS ADDED BACK ---
// Profile Completion Flow Component
const ProfileCompletion = ({ onProfileComplete, user }) => {
  const { t } = useContext(LanguageContext);
  const [step, setStep] = useState(1);
  const steps = [
      { name: t('profile.basicInfo') }, 
      { name: t('profile.skillsInterests') }, 
      { name: 'Resume Upload' },
      { name: t('profile.preferences') }
  ];
  const getStepStatus = (stepIndex) => {
    if (stepIndex < step) return 'completed'; if (stepIndex === step) return 'active'; return 'pending';
  };

  return (
    <div className="profile-form-container">
      <div className="profile-header"><h1>{t('profile.title')}</h1><p>{t('profile.subtitle')}</p></div>
      <div className="stepper">{steps.map((s, index) => (<div className={`step ${getStepStatus(index + 1)}`} key={s.name}><div className="step-number">{index + 1}</div><div className="step-name">{s.name}</div></div>))}</div>
      <div className="form-card">
        {step === 1 && <BasicInfoForm onNext={() => setStep(2)} user={user} />}
        {step === 2 && <SkillsInterestsForm onNext={() => setStep(3)} onBack={() => setStep(1)} user={user} />}
        {step === 3 && <ResumeUploadForm onNext={() => setStep(4)} onBack={() => setStep(2)} user={user} />}
        {step === 4 && <PreferencesForm onBack={() => setStep(3)} onComplete={onProfileComplete} user={user} />}
      </div>
    </div>
  );
};

// --- Form Components ---
const BasicInfoForm = ({ onNext, user }) => {
  const { t } = useContext(LanguageContext);
  const [formData, setFormData] = useState({ 
    phone: user?.phone || '', 
    location: user?.location || '', 
    education: user?.profile?.education || '', 
    studyField: user?.profile?.studyField || '',
    university: user?.profile?.university || '',
    githubLink: user?.profile?.githubLink || '',
    linkedinLink: user?.profile?.linkedinLink || ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  
  const validateAndProceed = async () => { 
    const newErrors = {}; 
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"; 
    if (!formData.location) newErrors.location = "Current location is required"; 
    if (!formData.education) newErrors.education = "Education level is required";
    if (formData.githubLink && !formData.githubLink.includes('github.com')) {
      newErrors.githubLink = "Please enter a valid GitHub URL";
    }
    if (formData.linkedinLink && !formData.linkedinLink.includes('linkedin.com')) {
      newErrors.linkedinLink = "Please enter a valid LinkedIn URL";
    }
    setErrors(newErrors); 
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        await authService.updateUserDetails({ phone: formData.phone, location: formData.location });
        await userService.updateUserProfile({ 
          education: formData.education, 
          studyField: formData.studyField,
          university: formData.university,
          githubLink: formData.githubLink,
          linkedinLink: formData.linkedinLink
        });
        onNext();
      } catch (error) {
        console.error('Failed to update profile:', error);
        alert('Failed to save. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (<><h3><LuUser /> {t('profile.basicInfo')}</h3><div className="form-grid"><div className="form-group"><label className="form-label">{t('profile.phone')} *</label><input type="tel" name="phone" className={`form-input ${errors.phone ? 'error' : ''}`} value={formData.phone} onChange={handleChange} disabled={isLoading} placeholder="+91 XXXXX XXXXX" />{errors.phone && <p className="error-message">{errors.phone}</p>}</div><div className="form-group"><label className="form-label">{t('profile.location')} *</label><select name="location" className={`form-select ${errors.location ? 'error' : ''}`} value={formData.location} onChange={handleChange} disabled={isLoading}><option value="">Select your city</option><option value="Delhi">Delhi</option><option value="Mumbai">Mumbai</option><option value="Kanpur">Kanpur</option><option value="Bangalore">Bangalore</option></select>{errors.location && <p className="error-message">{errors.location}</p>}</div><div className="form-group"><label className="form-label">{t('profile.education')} *</label><select name="education" className={`form-select ${errors.education ? 'error' : ''}`} value={formData.education} onChange={handleChange} disabled={isLoading}><option value="">Select education level</option><option value="High School">High School</option><option value="Undergraduate">Undergraduate</option><option value="Graduate">Graduate</option><option value="Postgraduate">Postgraduate</option></select>{errors.education && <p className="error-message">{errors.education}</p>}</div><div className="form-group"><label className="form-label">{t('profile.studyField')}</label><input type="text" name="studyField" className="form-input" value={formData.studyField} onChange={handleChange} disabled={isLoading} placeholder="e.g., Computer Science" /></div><div className="form-group"><label className="form-label">University Name</label><input type="text" name="university" className="form-input" value={formData.university} onChange={handleChange} disabled={isLoading} placeholder="e.g., IIT Delhi" /></div><div className="form-group"><label className="form-label">GitHub Profile</label><input type="url" name="githubLink" className={`form-input ${errors.githubLink ? 'error' : ''}`} value={formData.githubLink} onChange={handleChange} disabled={isLoading} placeholder="https://github.com/username" />{errors.githubLink && <p className="error-message">{errors.githubLink}</p>}</div><div className="form-group"><label className="form-label">LinkedIn Profile</label><input type="url" name="linkedinLink" className={`form-input ${errors.linkedinLink ? 'error' : ''}`} value={formData.linkedinLink} onChange={handleChange} disabled={isLoading} placeholder="https://linkedin.com/in/username" />{errors.linkedinLink && <p className="error-message">{errors.linkedinLink}</p>}</div></div><div className="form-actions" style={{ justifyContent: 'flex-end', paddingTop: '2.5rem', borderTop: 'none' }}><button className="next-button" onClick={validateAndProceed} disabled={isLoading}>{isLoading ? 'Saving...' : `${t('profile.nextBtn')} →`}</button></div></>);
};
const SkillsInterestsForm = ({ onNext, onBack, user }) => {
  const { t } = useContext(LanguageContext);
  const initialPopularSkills = ["JavaScript", "Python", "React", "Node.js", "SQL", "Java", "Excel", "Communication", "Leadership", "Problem Solving", "Team Work", "Time Management", "Digital Marketing", "Data Analysis", "Content Writing", "Graphic Design"];
  const initialSectors = ["Technology", "Healthcare", "Education", "Finance", "Manufacturing", "Agriculture", "Retail", "Media", "Government", "Ngo"];
  const [availableSkills, setAvailableSkills] = useState(initialPopularSkills.filter(s => !user?.profile?.skills?.includes(s))); 
  const [selectedSkills, setSelectedSkills] = useState(user?.profile?.skills || []); 
  const [availableSectors, setAvailableSectors] = useState(initialSectors.filter(s => !user?.profile?.sectors?.includes(s))); 
  const [selectedSectors, setSelectedSectors] = useState(user?.profile?.sectors || []); 
  const [inputValue, setInputValue] = useState(''); 
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const handleSelectSkill = (skill) => { if (!selectedSkills.includes(skill)) { setSelectedSkills([...selectedSkills, skill]); setAvailableSkills(availableSkills.filter(s => s !== skill)); } };
  const handleRemoveSkill = (skill) => { setSelectedSkills(selectedSkills.filter(s => s !== skill)); if (initialPopularSkills.includes(skill) && !availableSkills.includes(skill)) { setAvailableSkills([...availableSkills, skill]); } };
  const handleSkillInput = (event) => { if (event.key === 'Enter' && inputValue.trim() !== '') { const newSkill = inputValue.trim(); if (!selectedSkills.includes(newSkill)) { setSelectedSkills([...selectedSkills, newSkill]); setAvailableSkills(availableSkills.filter(s => s.toLowerCase() !== newSkill.toLowerCase())); } setInputValue(''); event.preventDefault(); } };
  const handleSelectSector = (sector) => { if (!selectedSectors.includes(sector)) { setSelectedSectors([...selectedSectors, sector]); setAvailableSectors(availableSectors.filter(s => s !== sector)); } };
  const handleRemoveSector = (sector) => { setSelectedSectors(selectedSectors.filter(s => s !== sector)); if (initialSectors.includes(sector) && !availableSectors.includes(sector)) { setAvailableSectors([...availableSectors, sector]); } };
  const validateAndProceed = async () => { 
    const newErrors = {}; 
    if (selectedSkills.length === 0) newErrors.skills = "Please add at least one skill"; 
    if (selectedSectors.length === 0) newErrors.sectors = "Please select at least one preferred sector"; 
    setErrors(newErrors); 
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        await userService.updateUserProfile({ skills: selectedSkills, sectors: selectedSectors });
        onNext();
      } catch (error) {
        console.error('Failed to update profile:', error);
        alert('Failed to save. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (<><h3><LuTarget /> {t('profile.skillsInterests')}</h3><div className="form-group full-width" style={{ marginTop: '2rem' }}><label className="form-label">{t('profile.yourSkills')} *</label><div style={{ position: 'relative' }}><input type="text" className={`form-input ${errors.skills ? 'error' : ''}`} placeholder="Type a skill and press Enter" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleSkillInput} /><button style={{ position: 'absolute', right: '8px', top: '8px', background: '#e5e7eb', border: 'none', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer' }}><LuPlus /></button></div>{errors.skills && !selectedSkills.length && <p className="error-message">{errors.skills}</p>}</div><div className="form-group full-width" style={{ marginTop: '1rem' }}><div className="form-section-title" style={{ fontSize: '0.875rem', color: 'var(--text-medium)' }}>{t('profile.popularSkills')}</div><div className="popular-skills">{availableSkills.map(skill => <span key={skill} className="skill-tag" onClick={() => handleSelectSkill(skill)}>{skill}</span>)}</div></div>{selectedSkills.length > 0 && (<div className="form-group full-width" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--sidebar-border)', paddingTop: '1.5rem' }}><div className="form-section-title" style={{ fontSize: '0.875rem' }}>{t('profile.yourSkills')}:</div><div className="popular-skills">{selectedSkills.map(skill => <span key={skill} className="skill-tag" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary-blue)', cursor: 'default' }}>{skill} <LuX style={{ cursor: 'pointer', marginLeft: '8px' }} onClick={() => handleRemoveSkill(skill)} /></span>)}</div></div>)}<div className="form-group full-width" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--sidebar-border)' }}><div className="form-section-title">{t('profile.preferredSectors')} *</div><p style={{ margin: '-0.5rem 0 1rem 0', color: 'var(--text-medium)', fontSize: '0.875rem' }}>{t('profile.chooseIndustries')}</p><div className="preferred-sectors">{availableSectors.map(sector => <span key={sector} className="sector-tag" onClick={() => handleSelectSector(sector)}>{sector}</span>)}</div>{errors.sectors && !selectedSectors.length && <p className="error-message">{errors.sectors}</p>}</div>{selectedSectors.length > 0 && (<div className="form-group full-width" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--sidebar-border)', paddingTop: '1.5rem' }}><div className="form-section-title" style={{ fontSize: '0.875rem' }}>{t('profile.yourSectors')}</div><div className="popular-skills">{selectedSectors.map(sector => <span key={sector} className="skill-tag" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary-blue)', cursor: 'default' }}>{sector} <LuX style={{ cursor: 'pointer', marginLeft: '8px' }} onClick={() => handleRemoveSector(sector)} /></span>)}</div></div>)}<div className="form-actions"><button className="back-button" onClick={onBack}>{t('profile.backBtn')}</button><button className="next-button" onClick={validateAndProceed}>{t('profile.nextBtn')} {t('profile.preferences')}</button></div></>);
};

// Resume Upload Form Component
const ResumeUploadForm = ({ onNext, onBack, user }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasResume, setHasResume] = useState(!!user?.profile?.resumePath);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    
    if (selectedFile) {
      // Check file type
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file only');
        setFile(null);
        return;
      }
      
      // Check file size (300KB = 307200 bytes)
      if (selectedFile.size > 307200) {
        setError('File size must not exceed 300KB');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const data = await userService.uploadResume(file);
      
      if (data.success) {
        setSuccess('Resume uploaded successfully!');
        setHasResume(true);
        setTimeout(() => {
          onNext();
        }, 1500);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <>
      <h3><LuFileText /> Resume Upload</h3>
      <div className="form-group full-width" style={{ marginTop: '2rem' }}>
        <label className="form-label">Upload Your Resume (PDF, Max 300KB)</label>
        <div style={{ 
          border: '2px dashed var(--sidebar-border)', 
          borderRadius: '12px', 
          padding: '2rem', 
          textAlign: 'center',
          backgroundColor: 'var(--background-color)',
          marginTop: '1rem'
        }}>
          {hasResume && !file && (
            <div style={{ marginBottom: '1rem', color: 'var(--primary-blue)' }}>
              <LuCircleCheck size={48} style={{ margin: '0 auto 1rem' }} />
              <p>Resume already uploaded</p>
            </div>
          )}
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="resume-upload"
            disabled={uploading}
          />
          <label 
            htmlFor="resume-upload" 
            style={{ 
              cursor: uploading ? 'not-allowed' : 'pointer',
              display: 'inline-block'
            }}
          >
            <div style={{ 
              padding: '1rem 2rem', 
              backgroundColor: 'var(--primary-blue)', 
              color: 'white', 
              borderRadius: '8px',
              display: 'inline-block',
              fontWeight: '600',
              opacity: uploading ? 0.6 : 1
            }}>
              {file ? 'Change File' : hasResume ? 'Upload New Resume' : 'Choose File'}
            </div>
          </label>
          {file && (
            <div style={{ marginTop: '1rem', color: 'var(--text-dark)' }}>
              <p><strong>Selected:</strong> {file.name}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-medium)' }}>
                Size: {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
          <p style={{ 
            marginTop: '1rem', 
            fontSize: '0.875rem', 
            color: 'var(--text-medium)' 
          }}>
            PDF format only • Maximum size: 300KB
          </p>
        </div>
        {error && <p className="error-message" style={{ marginTop: '1rem' }}>{error}</p>}
        {success && <p style={{ color: '#27ae60', marginTop: '1rem', fontWeight: '600' }}>{success}</p>}
      </div>
      <div className="form-actions" style={{ marginTop: '2rem' }}>
        <button className="back-button" onClick={onBack} disabled={uploading}>
          Back
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="secondary-button" 
            onClick={handleSkip} 
            disabled={uploading}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid var(--sidebar-border)',
              background: 'white',
              color: 'var(--text-dark)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Skip for Now
          </button>
          {file && !success && (
            <button 
              className="next-button" 
              onClick={handleUpload} 
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload & Continue →'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const PreferencesForm = ({ onBack, onComplete, user }) => {
  const { t } = useContext(LanguageContext);
  const [formData, setFormData] = useState({ 
    location: user?.profile?.preferredLocations?.[0] || '', 
    availability: user?.profile?.availability || '' 
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const validateAndComplete = async () => { 
    const newErrors = {}; 
    if (!formData.location) newErrors.location = "Please select a preferred work location"; 
    setErrors(newErrors); 
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        await userService.updateUserProfile({ 
          preferredLocations: [formData.location], 
          availability: formData.availability 
        });
        onComplete();
      } catch (error) {
        console.error('Failed to update profile:', error);
        alert('Failed to save. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (<><h3><LuBriefcase /> {t('profile.workPreferences')}</h3><div className="form-group full-width"><label className="form-label">{t('profile.preferredLocations')} *</label><select name="location" className={`form-select ${errors.location ? 'error' : ''}`} value={formData.location} onChange={handleChange} disabled={isLoading}><option value="">Select a city</option><option value="Delhi">Delhi</option><option value="Mumbai">Mumbai</option><option value="Bangalore">Bangalore</option><option value="Kanpur">Kanpur</option><option value="Remote">Remote</option></select>{errors.location && <p className="error-message">{errors.location}</p>}</div><div className="form-group full-width" style={{ marginTop: '1.5rem' }}><label className="form-label">{t('profile.whenStart')}</label><select name="availability" className="form-select" value={formData.availability} onChange={handleChange} disabled={isLoading}><option value="">Select availability</option><option value="Immediately">Immediately</option><option value="In 1 month">In 1 month</option><option value="In 2 months">In 2 months</option><option value="In 3+ months">In 3+ months</option></select></div><div className="form-actions"><button className="back-button" onClick={onBack} disabled={isLoading}>{t('profile.backBtn')}</button><button className="next-button" onClick={validateAndComplete} disabled={isLoading}>{isLoading ? 'Saving...' : t('dashboard.completeProfileBtn')}</button></div></>);
};
const AIAssistantModal = ({ onClose }) => {
  const { t, language } = useContext(LanguageContext);
  const API_KEY = "AIzaSyBe5lGUCkiDO7cBphomKyUeU-9dYevXQ80"; // ⚠️ PASTE YOUR API KEY HERE

  const [chatHistory, setChatHistory] = useState([{ role: 'model', text: t('aiAssistant.greeting') }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);
  const chatSession = useRef(null);

  useEffect(() => {
    if (!API_KEY) { console.warn("AI Assistant: API Key is missing."); return; }
    const genAI = new GoogleGenerativeAI(API_KEY);
    const safetySettings = [ { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }, ];
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });
    chatSession.current = model.startChat({ history: [] });
  }, [API_KEY]);

  useEffect(() => { if (chatBodyRef.current) { chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight; } }, [chatHistory, isLoading]);

  const handleSendMessage = async (messageText) => {
    const text = messageText.trim();
    if (!text || isLoading || !chatSession.current) {
        if (!API_KEY) { alert("AI Assistant is not configured. API Key is missing."); }
        return;
    }
    setInputValue('');
    setChatHistory(prev => [...prev, { role: 'user', text }]);
    setIsLoading(true);
    try {
        const prompt = `Please respond in ${language.name}. User's message: ${text}`;
        const result = await chatSession.current.sendMessage(prompt);
        const response = await result.response;
        const responseText = response.text();
        setChatHistory(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
        console.error("Error sending message to AI:", error);
        setChatHistory(prev => [...prev, { role: 'model', text: "Please specify your problem." }]);
    } finally {
        setIsLoading(false);
    }
  };
  const quickQuestions = [ t('aiAssistant.q1'), t('aiAssistant.q2'), t('aiAssistant.q3'), t('aiAssistant.contactSupport')];
  return (<div className="ai-modal-overlay" onClick={onClose}><div className="ai-modal-content" onClick={(e) => e.stopPropagation()}><div className="ai-modal-header"><div className="title"><span className="title-icon"><LuBot/></span> {t('aiAssistant.title')}</div><button className="close-btn" onClick={onClose}><LuX/></button></div><div className="chat-body" ref={chatBodyRef}>{chatHistory.map((msg, index) => (<div key={index} className={`chat-message ${msg.role}-message`}><div className="avatar">{msg.role === 'model' ? <LuBot/> : <LuCircleUserRound/>}</div><div className="bubble">{msg.text}</div></div>))}{isLoading && (<div className="chat-message model-message"><div className="avatar"><LuBot/></div><div className="bubble typing-indicator"><span></span><span></span><span></span></div></div>)}</div><div className="ai-modal-footer"><div className="quick-questions">{quickQuestions.map((q, i) => <button key={i} className="quick-question-btn" onClick={() => handleSendMessage(q)}>{q}</button>)}</div><form className="chat-input-form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}><input type="text" className="chat-input" placeholder={t('aiAssistant.inputPlaceholder')} value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={isLoading || !API_KEY} /><button type="submit" className="send-btn" disabled={isLoading || !inputValue.trim() || !API_KEY}><LuSend/></button></form></div></div></div>);
};

export default App;
