// Quick test script to verify login endpoint
const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('Testing login endpoint...\n');
    
    const response = await axios.post('https://intern4all-backend.onrender.com/api/auth/login', {
      email: 'aman@example.com',
      password: 'password'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
};

testLogin();
