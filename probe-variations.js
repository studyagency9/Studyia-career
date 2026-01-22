import axios from 'axios';

const baseUrl = 'https://studyia-career-backend.onrender.com';

const variations = [
  '/associates/signup',
  '/associate/signup',
  '/api/associate/signup',
  '/api/v1/associates/signup',
  '/v1/associates/signup',
  '/auth/associate/signup',
  '/api/auth/associate/signup',
  '/users/signup',
  '/api/users/signup'
];

async function probe() {
  console.log('Probing backend variations at:', baseUrl);
  
  for (const path of variations) {
    try {
      const url = `${baseUrl}${path}`;
      console.log(`POST ${url}`);
      const response = await axios.post(url, {}, {
        validateStatus: () => true,
        headers: {
            'Origin': 'http://localhost:5173'
        }
      });
      console.log(`  -> Status: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`  -> Error: ${error.message}`);
    }
  }
}

probe();
