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
      const response = await axios.get('https://api.apollo.io/v1/auth/health?api_key=${apiKey}', {
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
      // Need examples of correct formatting in the UI for the parameters
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

      //From the response, take the people who have a verified email status
      const verifiedPeople = apiResponse.data.people.filter(person => person.email_status.equals("verified")); 

      //Map those people to objects with the parameters we need to enrich
      const peopleData = verifiedPeople.map(person => ({
        firstName: person.first_name,
        lastName: person.last_name,
        id: person.id,
        title: person.title
      }));

      //For all the mapped people, get the email and insert them into our database
      for (const person of peopleData) {
        const person_email = await enrichProspect(person);
        person.email = person_email; 
      }

      //For all the people that are now enriched, insert their information into the db
      for (const person of peopleData) {
        try {
            const newUser = await pool.query(
              //go over this because we need a new table that isn't users
              //After creating the table we could just add the email to a created prospect
                "INSERT INTO prospects (apollo_id, first_name, last_name, job_title, email, enriched) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [person.firstName, person.lastName, person.id, person.title, person.email, true]
            );
            console.log(`Inserted:`, newUser.rows[0]);
        } catch (error) {
            console.error('Error inserting data:', error);
        }
      }

      //Return the array of people data
      res.json(peopleData); 
    } catch (error) {
      console.error('Error in search route:', error);
      res.status(500).send('An error occurred while processing your request');
    }
  });

  // Function to enrich a single person
  async function enrichProspect(prospect) {
    const data = {
      api_key: process.env.REQUEST_API_KEY,
      id: prospect.id,
      first_name: prospect.first_name,
      last_name: prospect.last_name
    };
    //make a request to the database
    const apiResponse = await axios.post('https://api.apollo.io/v1/people/match', data, {
      headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    }
    });
    //return the person's email from the 
    return apiResponse.data.person.email;
  }
  
  module.exports = router;
