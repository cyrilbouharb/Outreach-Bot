const express = require("express");
const router = express.Router();
const pool = require("../db");
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // Add this for generating UUIDs


var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'outreachbot@gmail.com',
      pass: 'nglteophfzobysfp' // It's recommended to use environment variables or OAuth2 for storing and accessing sensitive credentials
    }
  });


router.post('/signup', async (req, res) => {
    try {
      console.log("Received signup request", req.body);
      const { first_name, last_name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = uuidv4(); // Generate a unique verification token
      // Insert user into database with verification token
      const newUser = await pool.query(
        "INSERT INTO users (first_name, last_name, email, encrypted_password, verification_token) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [first_name, last_name, email, hashedPassword, verificationToken]
      );
      // Send verification email
      var mailOptions = {
        from: 'outreachbot@gmail.com',
        to: email,
        subject: 'Verify Your Email',
        text: `Please verify your email by clicking on the following link: http://localhost:3000/email_verification?token=${verificationToken}` // Adjust the URL as per your front-end route for email verification
      };
      // added await
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent: ' + info.response);
      } catch (error) {
        console.log(error);
      }
      res.json(newUser.rows[0]);
    } catch (error) {
      console.error('Signup Error:', error);
      if (error.code === '23505') { // 23505 is the error code for unique violation in PostgreSQL
        res.status(400).send("An account with this email already exists.");
      } else {
        res.status(500).send("Server error");
      }
    }
  });
  
  
  // for login 
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = userResult.rows[0];
      
      if (!user) {
        return res.status(401).json({ message: "Invalid Credentials or User Not Found." });
      }
  
      // Check if the user's email is verified
      if (!user.email_verified) {
        return res.status(403).json({ message: "Please verify your email before logging in." });
      } 
  
      // Check if submitted password matches the stored hash
      const validPassword = await bcrypt.compare(password, user.encrypted_password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid Credentials." });
      }
  
      // Generate and return JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token: token, message: "Login successful" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: "Server error" });
    }
  });


  router.post('/forgot-password', async (req, res) => {
    const {email} = req.body;
    // UserModel.findOne({email: email})
  
        // if(!user) {
        //     return res.send({Status: "User doesnt exist"})
        // }
      // Check if user exists
      const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  
      if (user.rows.length === 0) {
        console.log("entered index 87");
        return res.status(401).json("Invalid Credential");
        // return res.send({Status: "User not existed"})
      } 
        // const token = jwt.sign({id: user._id}, "jwt_secret_key", {expiresIn: "1d"})
        const token = jwt.sign({id: user.rows[0].username}, "jwt_secret_key", {expiresIn: "1d"})
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'outreachbot@gmail.com',
              pass: 'nglteophfzobysfp'
            }
          });
          
          var mailOptions = {
            from: 'outreachbot@gmail.com',
            to: email,
            subject: 'Reset Password Link',
            text: `Hi,\n We have received your reset password request. You can reset your password by clicking on the following link:\n http://localhost:3000/reset_password?userId=${user.rows[0].id}&token=${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              return res.send({Status: "Success"})
            }
          });
    
  });
  
  router.post('/reset-password', (req, res) => {
    const { userId, token } = req.query;
    const { password } = req.body;
    console.log(userId)
    console.log(token)
    console.log(password);
    // Your existing logic for verifying the token, hashing the new password, and updating the user record
    try {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        } else {
          // Assume `userId` is decoded or validated to match an existing user
          const hashedPassword = await bcrypt.hash(password, 10);
          await pool.query("UPDATE users SET encrypted_password = $1 WHERE id = $2", [hashedPassword, userId]);
          res.json({ message: "Password updated successfully" });
        }
      });
    } catch (error) {
      res.status(500).send({ message: "Server error" });
    }
  });
  
  
  router.get('/verify-email', async (req, res) => {
    try {
      const { token } = req.query;
      const user = await pool.query("SELECT * FROM users WHERE verification_token = $1", [token]);
  
      if (user.rows.length > 0) {
        await pool.query("UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE verification_token = $1", [token]);
        res.send("Email verified successfully.");
      } 
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error during email verification.");
    }
  });


  module.exports = router;
