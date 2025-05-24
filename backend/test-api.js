const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function testAPI() {
  try {
    // Test login
    console.log('\nTesting login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'testadmin@example.com',
      password: 'Admin123!',
    });
    console.log('Login successful:', loginResponse.data);

    const token = loginResponse.data.token;

    // Test get current user
    console.log('\nTesting get current user...');
    const userResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Get current user successful:', userResponse.data);

    // Update user role to editor
    console.log('\nUpdating user role to editor...');
    const updateResponse = await axios.put(
      `${API_URL}/auth/profile`,
      { role: 'editor' },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('Update user role successful:', updateResponse.data);

    // Test create content
    console.log('\nTesting create content...');
    const contentResponse = await axios.post(
      `${API_URL}/content`,
      {
        title: 'Test Content',
        content: 'This is a test content.',
        type: 'page',
        status: 'draft',
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('Create content successful:', contentResponse.data);

    // Test get content
    console.log('\nTesting get content...');
    const getContentResponse = await axios.get(`${API_URL}/content/${contentResponse.data._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Get content successful:', getContentResponse.data);
  } catch (error) {
    console.error('Error details:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    console.error('Full error:', error);
  }
}

testAPI();
