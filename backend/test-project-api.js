import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Test data
const testUser = {
  email: 'testadmin@example.com',
  password: 'Admin123!',
};

const testProject = {
  name: 'Test Project',
  code: 'TP001',
  description: 'A test project for API testing',
  type: 'construction',
  status: 'planning',
  priority: 'medium',
  plannedStartDate: new Date().toISOString(),
  plannedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  location: {
    address: {
      street: 'Test Street',
      city: 'Test City',
      state: 'Test State',
      zipCode: '1234 AB',
      country: 'Netherlands',
    },
  },
};

let token;
let projectId;

async function testAPI() {
  try {
    // Login
    console.log('Testing login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, testUser);
    token = loginResponse.data.token;
    console.log('Login successful');

    // Create project
    console.log('\nTesting project creation...');
    const createResponse = await axios.post(`${API_URL}/projects`, testProject, {
      headers: { Authorization: `Bearer ${token}` },
    });
    projectId = createResponse.data._id;
    console.log('Project created successfully');

    // Get all projects
    console.log('\nTesting get all projects...');
    const getAllResponse = await axios.get(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Retrieved all projects successfully');

    // Get single project
    console.log('\nTesting get single project...');
    const getOneResponse = await axios.get(`${API_URL}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Retrieved single project successfully');

    // Update project
    console.log('\nTesting project update...');
    const updateResponse = await axios.put(
      `${API_URL}/projects/${projectId}`,
      {
        ...testProject,
        name: 'Updated Test Project',
        status: 'active',
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('Project updated successfully');

    // Delete project
    console.log('\nTesting project deletion...');
    const deleteResponse = await axios.delete(`${API_URL}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Project deleted successfully');

    console.log('\nAll tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAPI();
