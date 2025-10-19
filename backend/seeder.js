const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Internship = require('./models/Internship');
const Application = require('./models/Application');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@intern4all.com',
    password: 'password123',
    role: 'admin',
    authProvider: 'local',
  },
  {
    name: 'Tech Recruiter',
    email: 'recruiter@example.com',
    password: 'password123',
    role: 'recruiter',
    phone: '+91-9876543210',
    location: 'Mumbai',
    authProvider: 'local',
  },
  {
    name: 'Aman Yadav',
    email: 'aman@example.com',
    password: 'password',
    phone: '+91-7317208443',
    location: 'Delhi',
    role: 'intern',
    authProvider: 'local',
    profile: {
      education: 'Undergraduate',
      studyField: 'Computer Science',
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      sectors: ['Technology', 'Education'],
      preferredLocations: ['Delhi', 'Remote'],
      availability: 'Immediately',
      isComplete: true,
    },
  },
];

const internships = [
  {
    title: 'AI/ML Research Intern',
    company: 'Google',
    companyLogo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    description: 'Join our AI research team to work on cutting-edge machine learning projects. You will collaborate with experienced researchers and engineers to develop innovative AI solutions.',
    requirements: [
      'Currently pursuing or recently completed a degree in Computer Science, AI, or related field',
      'Strong programming skills in Python',
      'Understanding of machine learning algorithms',
      'Excellent problem-solving abilities',
    ],
    responsibilities: [
      'Assist in developing and testing ML models',
      'Conduct research on latest AI techniques',
      'Collaborate with team members on projects',
      'Document findings and present results',
    ],
    location: 'Remote',
    locationType: 'Remote',
    stipend: '₹ 30,000/month',
    duration: '6 months',
    startDate: new Date('2025-02-01'),
    applicationDeadline: new Date('2025-01-15'),
    tags: ['Machine Learning', 'Python', 'Research', 'AI'],
    sector: 'Technology',
    skillsRequired: ['Python', 'Machine Learning', 'TensorFlow', 'Research'],
    numberOfOpenings: 3,
    status: 'active',
  },
  {
    title: 'Frontend Developer Intern',
    company: 'Microsoft',
    companyLogo: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b',
    description: 'Work on building modern web applications using React and TypeScript. You will be part of a dynamic team creating user-friendly interfaces for millions of users.',
    requirements: [
      'Strong knowledge of HTML, CSS, and JavaScript',
      'Experience with React or similar frameworks',
      'Understanding of responsive design',
      'Good communication skills',
    ],
    responsibilities: [
      'Develop and maintain web applications',
      'Implement responsive UI components',
      'Collaborate with designers and backend developers',
      'Write clean, maintainable code',
    ],
    location: 'Bangalore',
    locationType: 'Hybrid',
    stipend: '₹ 25,000/month',
    duration: '4 months',
    startDate: new Date('2025-01-20'),
    applicationDeadline: new Date('2025-01-10'),
    tags: ['React', 'JavaScript', 'CSS', 'Frontend'],
    sector: 'Technology',
    skillsRequired: ['React', 'JavaScript', 'CSS', 'HTML'],
    numberOfOpenings: 5,
    status: 'active',
  },
  {
    title: 'Product Management Intern',
    company: 'SkillSync',
    companyLogo: '',
    description: 'Learn product management from the ground up. Work on real product features, conduct user research, and help shape the future of our platform.',
    requirements: [
      'Strong analytical and problem-solving skills',
      'Excellent communication abilities',
      'Interest in technology and product development',
      'Basic understanding of UI/UX principles',
    ],
    responsibilities: [
      'Assist in product planning and roadmap development',
      'Conduct user research and gather feedback',
      'Work with engineering and design teams',
      'Analyze product metrics and user data',
    ],
    location: 'Delhi',
    locationType: 'On-site',
    stipend: '₹ 20,000/month',
    duration: '3 months',
    startDate: new Date('2025-02-15'),
    applicationDeadline: new Date('2025-01-25'),
    tags: ['Product', 'Management', 'UI/UX', 'Analytics'],
    sector: 'Technology',
    skillsRequired: ['Product Management', 'Communication', 'Analytics'],
    numberOfOpenings: 2,
    status: 'active',
  },
  {
    title: 'Data Science Intern',
    company: 'Amazon',
    companyLogo: '',
    description: 'Work with large datasets to derive insights and build predictive models. Collaborate with data scientists and engineers on impactful projects.',
    requirements: [
      'Strong foundation in statistics and mathematics',
      'Programming skills in Python or R',
      'Experience with data analysis tools',
      'Knowledge of SQL',
    ],
    responsibilities: [
      'Analyze large datasets to identify trends',
      'Build and evaluate predictive models',
      'Create data visualizations and reports',
      'Collaborate with cross-functional teams',
    ],
    location: 'Mumbai',
    locationType: 'On-site',
    stipend: '₹ 35,000/month',
    duration: '6 months',
    startDate: new Date('2025-03-01'),
    applicationDeadline: new Date('2025-02-10'),
    tags: ['Data Science', 'Python', 'SQL', 'Analytics'],
    sector: 'Technology',
    skillsRequired: ['Python', 'SQL', 'Data Analysis', 'Statistics'],
    numberOfOpenings: 4,
    status: 'active',
  },
  {
    title: 'Content Writing Intern',
    company: 'HubSpot',
    companyLogo: '',
    description: 'Create engaging content for our blog, social media, and marketing campaigns. Learn content strategy and SEO best practices.',
    requirements: [
      'Excellent writing and editing skills',
      'Understanding of SEO principles',
      'Creativity and attention to detail',
      'Ability to research and write on various topics',
    ],
    responsibilities: [
      'Write blog posts and articles',
      'Create social media content',
      'Optimize content for SEO',
      'Collaborate with marketing team',
    ],
    location: 'Remote',
    locationType: 'Remote',
    stipend: '₹ 15,000/month',
    duration: '3 months',
    startDate: new Date('2025-01-15'),
    applicationDeadline: new Date('2025-01-05'),
    tags: ['Content Writing', 'SEO', 'Marketing', 'Communication'],
    sector: 'Media',
    skillsRequired: ['Content Writing', 'SEO', 'Communication'],
    numberOfOpenings: 3,
    status: 'active',
  },
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Internship.deleteMany();
    await Application.deleteMany();

    // Create users from the seed file
    const createdUsers = await User.create(users);
    console.log('✅ Users imported');

    // Find the recruiter user to assign as postedBy for internships
    const recruiterUser = createdUsers.find(
      (user) => user.role === 'recruiter'
    );

    // --- SAFETY CHECK ADDED HERE ---
    // If no recruiter user is found in your seed data, exit with a clear error.
    if (!recruiterUser) {
      console.error('❌ Error: No user with role "recruiter" found in seed data.');
      process.exit(1);
    }

    // Assign the found recruiter user's ID to each sample internship
    const internshipsWithPostedBy = internships.map((internship) => ({
      ...internship,
      postedBy: recruiterUser._id,
    }));

    await Internship.create(internshipsWithPostedBy);
    console.log('✅ Internships imported');

    console.log('✅ Data imported successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Internship.deleteMany();
    await Application.deleteMany();

    console.log('✅ Data deleted successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error deleting data:', error);
    process.exit(1);
  }
};

// Run based on command line argument
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import or -d to delete data');
  process.exit();
}
