const express = require('express');
const axios = require('axios');
const router = express.Router();

//method to test the authorization endpoint
router.get('/auth', async (req, res) => {
    try {
      // Replace with the actual endpoint and parameters you need
      const apiKey = process.env.REQUEST_API_KEY;
      const response = await axios.get('https://api.apollo.io/v1/auth/health?api_key=S{apiKey}', {
        headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-api-key': process.env.REQUEST_API_KEY,
      }
      });
  
      console.log(response.data);
      res.json(response.data);
    } catch (error) {
      console.error('Error connecting to Apollo.io:', error);
      res.status(500).send('Error connecting to Apollo.io');
    }
  });
  
  module.exports = router;



