import axios from 'axios';

const baseUrl = 'https://studyia-career-backend.onrender.com';

const paths = [
  '/',
  '/api',
  '/api/',
  '/api/associates/signup', // We expect 404 or 405 (Method Not Allowed) for GET, but 404 would be specific
  '/health',
  '/api/health'
];

async function probe() {
  console.log('Probing backend at:', baseUrl);
  
  for (const path of paths) {
    try {
      const url = `${baseUrl}${path}`;
      console.log(`GET ${url}`);
      const response = await axios.get(url, {
        validateStatus: () => true, // resolve promise for all status codes
        headers: {
            'Origin': 'http://localhost:5173'
        }
      });
      console.log(`  -> Status: ${response.status} ${response.statusText}`);
      if (response.headers['content-type']) {
        console.log(`  -> Content-Type: ${response.headers['content-type']}`);
      }
    } catch (error) {
      console.log(`  -> Error: ${error.message}`);
    }
  }
}

probe();
