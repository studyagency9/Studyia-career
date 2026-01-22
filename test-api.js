import axios from 'axios';

async function testEndpoint() {
  const url = 'https://studyia-career-backend.onrender.com/api/associates/signup';
  console.log(`Testing POST to ${url}...`);
  
  try {
    // We expect a 400 or similar if we send empty data, but not 404
    // If it's 404, the path is wrong.
    const response = await axios.post(url, {
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
        phone: "1234567890",
        country: "France",
        city: "Paris"
    }, {
        headers: {
            'Origin': 'http://localhost:5173',
            'Content-Type': 'application/json'
        },
        validateStatus: () => true // Don't throw on error status
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Response data:', response.data);
    
  } catch (error) {
    console.error('Request failed:', error.message);
    if (error.response) {
        console.log('Error status:', error.response.status);
    }
  }
}

testEndpoint();
