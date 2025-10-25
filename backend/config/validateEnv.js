/**
 * Environment Variable Validation
 * Ensures all required environment variables are set before starting the server
 */

const validateEnv = () => {
  const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'JWT_COOKIE_EXPIRE',
    'FRONTEND_URL'
  ];

  const missingVars = [];

  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease set these variables in your .env file');
    process.exit(1);
  }

  // Validate JWT_SECRET length
  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long for security');
    process.exit(1);
  }

  // Validate NODE_ENV
  const validEnvs = ['development', 'production', 'test'];
  if (!validEnvs.includes(process.env.NODE_ENV)) {
    console.warn(`⚠️  NODE_ENV should be one of: ${validEnvs.join(', ')}`);
  }

  console.log('✅ Environment variables validated successfully');
};

module.exports = validateEnv;
