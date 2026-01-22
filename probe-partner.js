import axios from 'axios';

const baseUrl = 'https://studyia-career-backend.onrender.com';

async function probe() {
  console.log('Probing partner login...');
  const url = `${baseUrl}/api/auth/login`;
  console.log(`POST ${url}`);
  try {
      const response = await axios.post(url, {
        email: "test@example.com",
        password: "password"
    }, {
        headers: {
            'Origin': 'http://localhost:5173'
        },
        validateStatus: () => true 
    });
      console.log(`  -> Status: ${response.status} ${response.statusText}`);
  } catch (error) {
      console.log(`  -> Error: ${error.message}`);
  }
}

probe();
