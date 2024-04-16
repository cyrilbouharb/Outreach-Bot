const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Route for user signup
  app.post('/signup', async (req, res) => {
    try {
      console.log("Received signup request", req.body); // Log the request body
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); // Hash password

      // Insert user into database
      const newUser = await pool.query(
        "INSERT INTO users (username, email, encrypted_password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, hashedPassword]
      );

      res.status(200).json(newUser.rows[0]); // Set status code to 200 and return user data
    } catch (error) {
      console.error('Signup Error:', error.message);
      res.status(500).send("Server error");
    }
  });

  // Route for user login
  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

      if (user.rows.length === 0) {
        return res.status(401).json("Invalid Credential");
      }

      // Check if submitted password matches the stored hash
      const validPassword = await bcrypt.compare(password, user.rows[0].encrypted_password);

      if (!validPassword) {
        return res.status(401).json("Invalid Credential");
      }

      // Generate and return JWT
      const token = jwt.sign({ id: user.rows[0].id }, "yourSecretKey", { expiresIn: "1h" }); // Replace "yourSecretKey" with a real secret key
      res.status(200).json({ username: user.rows[0].username, token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  return app;
}
module.exports = createApp;


// const express = require("express");
// const app = express();
// const cors = require("cors");
// const pool = require("./db")

// app.use(cors());
// app.use(express.json());

// //Routes//
// const bcrypt = require('bcrypt');

// // Assuming you have a users table with username, email, and hashed_password columns

// app.post('/signup', async (req, res) => {
//   try {
//     console.log("Received signup request", req.body); // Log the request body
//     const { username, email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10); // Hash password

//     // Insert user into database
//     const newUser = await pool.query(
//       "INSERT INTO users (username, email, encrypted_password) VALUES ($1, $2, $3) RETURNING *",
//       [username, email, hashedPassword]
//     );

//     res.json(newUser.rows[0]);
//   } catch (error) {
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.error('Signup error:', error.response.data);
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error('Signup error: No response', error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error('Signup Error:', error.message);
//     }
//   }
  
// });

// const jwt = require('jsonwebtoken');

// // for login 
// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

//     if (user.rows.length === 0) {
//       return res.status(401).json("Invalid Credential");
//     }

//     // Check if submitted password matches the stored hash
//     const validPassword = await bcrypt.compare(password, user.rows[0].encrypted_password);

//     if (!validPassword) {
//       return res.status(401).json("Invalid Credential");
//     }

//     // Generate and return JWT
//     const token = jwt.sign({ id: user.rows[0].id }, "yourSecretKey", { expiresIn: "1h" }); // Replace "yourSecretKey" with a real secret key
//     res.json({ username: user.rows[0].username, token });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });


// app.listen(5000, () => {
//     console.log("server has started on port 5000")
// });
