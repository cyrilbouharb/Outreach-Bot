const express = require('express');
const axios = require('axios');
const router = express.Router();
const pool = require("./db");

//method to test the authorization endpoint
router.get('/auth', async (req, res) => {
    try {
      //get the api key from the .env file
      const apiKey = process.env.REQUEST_API_KEY;
      //create the request with the specified parameters
      const response = await axios.get('https://api.apollo.io/v1/auth/health?api_key=S{apiKey}', {
        headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-api-key': process.env.REQUEST_API_KEY,
      }
      });
      //log the response
      console.log(response.data);
      res.json(response.data);
    } catch (error) {
      //error handling
      console.error('Error connecting to Apollo.io:', error);
      res.status(500).send('Error connecting to Apollo.io');
    }
  });

  //endpoint for searching Apollos database for people. This endpoing will NOT work without a paid subscription
  router.post('/search', async (req, res) => {
    try {
      const userData = req.body; 
      // Log the request body
      console.log("Received search request", userData); 
      // Format the data inputted by the user **coordinate with the frontend team on how this is structured**
      const data = {
        api_key: process.env.REQUEST_API_KEY,
        q_organization_domains: userData.body.domain,
        organization_locations: userData.body.location,
        person_titles: userData.body.title
      };
      // create a request to the apollo api
      const apiResponse = await axios.post('https://api.apollo.io/v1/mixed_people/search', data, {
        headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      }
      });
      //insert into the database here? If so we can filter on the people and take the id, first name, last name, of people with verified emails, get Cyril's opinion
      //From the response, take the people who have a verified email status
      const verifiedPeople = apiResponse.data.people.filter(person => person.email_status.equals("verified")); 

      //Map those people to objects with the parameters we need to enrich
      const peopleData = verifiedPeople.map(person => ({
        firstName: person.first_name,
        lastName: person.last_name,
        id: person.id,
        title: person.title
      }));

      //For all the mapped people, insert them into our database
      for (const person of peopleData) {
        try {
            const newUser = await pool.query(
                "INSERT INTO users (first_name, last_name, user_id, title) VALUES ($1, $2, $3, $4) RETURNING *",
                [person.firstName, person.lastName, person.id, person.title]
            );
            console.log(`Inserted:`, newUser.rows[0]);
        } catch (error) {
            console.error('Error inserting data:', error);
        }
      }

      res.json(response.data); 
    } catch (error) {
      console.error('Error in search route:', error);
      res.status(500).send('An error occurred while processing your request');
    }
  });

  //endpoint for enriching a single person
  router.get('/enrich', async (req, res) => {
    try {
      const apiKey = process.env.REQUEST_API_KEY;
      //get the data from the database here?
    } catch (error) {
      
    }
  });

  //endpoint for enriching multiple people
  router.get('/bulk_enrich', async (req, res) => {
    try {
      const apiKey = process.env.REQUEST_API_KEY;

    } catch (error) {
      
    }
  });
  
  module.exports = router;



