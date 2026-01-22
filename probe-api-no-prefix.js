import axios from 'axios';

const baseUrl = 'https://studyia-career-backend.onrender.com';

async function probe() {
  console.log('Probing backend at:', baseUrl);
  const url = `${baseUrl}/associates/signup`; // No /api prefix
  console.log(`POST ${url}`);
  try {
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
        validateStatus: () => true 
    });
      console.log(`  -> Status: ${response.status} ${response.statusText}`);
      console.log('Response data:', response.data);
  } catch (error) {
      console.log(`  -> Error: ${error.message}`);
  }
}

probe();
