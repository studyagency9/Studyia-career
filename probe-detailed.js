import axios from 'axios';

const baseUrl = 'https://studyia-career-backend.onrender.com';

const endpoints = [
  { method: 'POST', url: '/api/associates/signup' },
  { method: 'POST', url: '/api/associates/login' }, // Check if login exists
  { method: 'GET', url: '/api/associates/dashboard' }, // Check if dashboard exists (might be 401)
  { method: 'POST', url: '/api/auth/login' }, // We know this works (401)
  { method: 'POST', url: '/api/signup' },
  { method: 'POST', url: '/api/register' },
];

async function probe() {
  console.log('Detailed Probing...');
  
  for (const ep of endpoints) {
    const fullUrl = `${baseUrl}${ep.url}`;
    console.log(`${ep.method} ${fullUrl}`);
    try {
      const response = await axios({
        method: ep.method,
        url: fullUrl,
        data: {
             email: "probe@test.com",
             password: "password"
        },
        headers: {
            'Origin': 'http://localhost:5173'
        },
        validateStatus: () => true
      });
      console.log(`  -> Status: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`  -> Error: ${error.message}`);
      if (error.response) {
          console.log(`  -> Error Status: ${error.response.status}`);
      }
    }
  }
}

probe();
