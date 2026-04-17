const axios = require('axios');

async function test() {
  try {
    // 1. Register admin
    let adminToken;
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Admin Test', email: 'admin2@test.com', password: 'password', role: 'admin'
      });
      adminToken = res.data.token;
      console.log('Admin registered');
    } catch(e) {
      if(e.response && e.response.status === 400) {
        console.log('Admin already exists, logging in...');
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: 'admin2@test.com', password: 'password'
        });
        adminToken = res.data.token;
      } else {
        throw e;
      }
    }

    // 2. Fetch residents
    try {
      const res = await axios.get('http://localhost:5000/api/auth/residents', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('Residents fetched:', res.data);
    } catch(e) {
      console.error('Fetch residents failed:', e.response ? e.response.data : e.message);
    }
  } catch(e) {
    console.error('Test failed:', e.message);
  }
}
test();
