const express = require('express');
const axios = require('axios');
const router = express.Router();
const pool = require("./db");

//Method to test the authorization endpoint
// router.get('/auth', async (req, res) => {
//     try {
//         const apiKey = process.env.REQUEST_API_KEY;
//         // Correctly use template literals for API key
//         const response = await axios.get(`https://api.apollo.io/v1/auth/health?api_key=${apiKey}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Cache-Control': 'no-cache',
//                 'x-api-key': apiKey,
//             }
//         });
//         console.log(response.data);
//         res.json(response.data);
//     } catch (error) {
//         console.error('Error connecting to Apollo.io:', error);
//         res.status(500).send('Error connecting to Apollo.io');
//     }
// });

async function authenticate(apiKey) {
    try {
        const response = await axios.get(`https://api.apollo.io/v1/auth/health?api_key=${apiKey}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'x-api-key': apiKey,
            }
        });
        console.log(response.data);
        return true; // Authentication successful
    } catch (error) {
        console.error('Error connecting to Apollo.io:', error);
        return false; // Authentication failed
    }
}
// router.get('/auth', async (req, res) => {
//     const apiKey = process.env.REQUEST_API_KEY;
//     if (await authenticate(apiKey)) {
//         res.json({ message: "Authentication successful" });
//     } else {
//         res.status(500).send('Error connecting to Apollo.io');
//     }
// });

// Endpoint for searching, enriching, and returning people
router.post('/search', async (req, res) => {
    console.log("in search");
    const apiKey = process.env.REQUEST_API_KEY;
    // Authenticate before searching
    if (!(await authenticate(apiKey))) {
        return res.status(401).send('Authentication failed');
    }
  
    // let apiResponse; // Declare outside try block
    console.log("before try");
    try {
      console.log("Received signup request", req.body);
      const { organization, location, title} = req.body;
        const userData = req.body;
        const data = {
            api_key: process.env.REQUEST_API_KEY,
            q_organization_domains: organization, // Assuming userData has direct properties
            organization_locations: location,
            person_titles: title
        };
        const apiResponse = await axios.post('https://api.apollo.io/v1/mixed_people/search', data, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            }
        });

        const verifiedPeople = apiResponse.data.people.filter(person => person.email_status === "verified");
        console.log(verifiedPeople);
        // const peopleData = await Promise.all(verifiedPeople.map(async (person) => {
        //     const person_email = await enrichProspect(person);
        //     return {
        //         ...person,
        //         email: person_email
        //     };
        // }));

        // if (peopleData.length === 0) {
        //     return res.json("No people matched the search criteria");
        // }

        // for (const person of peopleData) {
        //     const newUser = await pool.query(
        //         "INSERT INTO prospects (apollo_id, first_name, last_name, job_title, email) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        //         [person.id, person.first_name, person.last_name, person.title, person.email]
        //     );
        //     console.log(`Inserted:`, newUser.rows[0]);
        // }

        // res.json(peopleData);
    } catch (error) {
        console.error('Error in search route:', error);
        res.status(500).send('An error occurred while processing your request');
    }
});

  // Function to enrich a single person and get their email 
  async function enrichProspect(prospect) {
    let apiResponse; // Declare outside try block
    const data = {
        api_key: process.env.REQUEST_API_KEY,
        id: prospect.id,
        first_name: prospect.first_name,
        last_name: prospect.last_name
    };
    try {
        apiResponse = await axios.post('https://api.apollo.io/v1/people/match', data, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            }
        });
        return apiResponse.data.person.email; // Correctly return the email
    } catch (error) {
        console.error('Error in enrichment route:', error);
        throw new Error('Error enriching with Apollo.io'); // Throw to handle in the calling function
    }
}
  
  module.exports = router;