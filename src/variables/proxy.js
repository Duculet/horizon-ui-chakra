const express = require('express');
const axios = require('axios');
const cors = require('cors');


// Load environment variables from .env file
console.log('Loading environment variables...');
// Check if environment variables are loaded
console.log(process.env);


const app = express();
app.use(cors());

// Salesforce OAuth endpoint
app.get('/api/auth', async (req, res) => {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', process.env.SF_CLIENT_ID);
    params.append('client_secret', process.env.SF_CLIENT_SECRET);
    params.append('username', process.env.SF_USERNAME);
    params.append('password', process.env.SF_PASSWORD);

    const response = await axios.post(
      'https://login.salesforce.com/services/oauth2/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Auth error:', error.response.data);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Salesforce query endpoint
app.get('/api/leads', async (req, res) => {
  try {
    const { access_token, instance_url } = req.query;
    
    const response = await axios.get(
      `${instance_url}/services/data/v56.0/query?q=SELECT+Id,FirstName,LastName,Email,Company,Status,CreatedDate+FROM+Lead+ORDER+BY+CreatedDate+DESC+LIMIT+100`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Leads error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

app.listen(process.env.REACT_APP_PORT, () => {
  console.log(`Server running on port ${process.env.REACT_APP_PORT}`);
});