const express = require('express');
const axios = require('axios');
const router = express.Router();
const pool = require("./db");

//Method to test the authorization endpoint
router.get('/auth', async (req, res) => {
    try {
      //Get the api key from the .env file
      const apiKey = process.env.REQUEST_API_KEY;
      //Create the request with the specified parameters
      const response = await axios.get('https://api.apollo.io/v1/auth/health?api_key=${apiKey}', {
        headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-api-key': process.env.REQUEST_API_KEY,
      }
      });
      //Log the response
      console.log(response.data);
      res.json(response.data);
    } catch (error) {
      //Error handling
      console.error('Error connecting to Apollo.io:', error);
      res.status(500).send('Error connecting to Apollo.io');
    }
  });

  //Endpoint that includes searching, enriching, and returning people with enriched information to the UI
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
      // Create a request to the apollo api
      try {
        const apiResponse = await axios.post('https://api.apollo.io/v1/mixed_people/search', data, {
        headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        }
        });
      } catch (error) {
        console.error('An error occured when searching:', error);
        res.status(500).send('Error searching with Apollo.io');
      }
      

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
      if(peopleData.length !== 0){
        for (const person of peopleData) {
          const person_email = await enrichProspect(person);
          person.email = person_email; 
        }
      }
      else{
        res.json("No people matched the search criteria");
      }

      //For all the people that are now enriched, insert their information into the db
      for (const person of peopleData) {
        try {
            const newUser = await pool.query(
              //go over this because we need a new table that isn't users
              //After creating the table we could just add the email to a created prospect
                "INSERT INTO prospects (apollo_id, first_name, last_name, job_title, email) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [person.firstName, person.lastName, person.id, person.title, person.email]
            );
            console.log(`Inserted:`, newUser.rows[0]);
        } catch (error) {
            console.error('Error inserting data:', error);
            res.status(500).send('Error inserting data in the database');
        }
      }

      //Return the array of people data
      res.json(peopleData); 
    } catch (error) {
      console.error('Error in search route:', error);
      res.status(500).send('An error occurred while processing your request');
    }
  });

  // Function to enrich a single person and get their email 
  async function enrichProspect(prospect) {
    const data = {
      api_key: process.env.REQUEST_API_KEY,
      id: prospect.id,
      first_name: prospect.first_name,
      last_name: prospect.last_name
    };
    //make a request to the database
    try {
      const apiResponse = await axios.post('https://api.apollo.io/v1/people/match', data, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      }
      });
    } catch (error) {
      console.error('Error in enrichment route:', error);
      res.status(500).send('Error enriching with Apollo.io');
    }
    
    //return the person's email
    return apiResponse.data.person.email;
  }
  
  module.exports = router;
