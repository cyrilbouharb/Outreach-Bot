const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db")
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // Add this for generating UUIDs


app.use(cors());
app.use(express.json());

//Routes//

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'outreachbot@gmail.com',
    pass: 'nglteophfzobysfp' // It's recommended to use environment variables or OAuth2 for storing and accessing sensitive credentials
  }
});


app.post('/signup', async (req, res) => {
  try {
    console.log("Received signup request", req.body);
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4(); // Generate a unique verification token

    // Insert user into database with verification token
    const newUser = await pool.query(
      "INSERT INTO users (username, email, encrypted_password, verification_token) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, verificationToken]
    );

    // Send verification email
    var mailOptions = {
      from: 'outreachbot@gmail.com',
      to: email,
      subject: 'Verify Your Email',
      text: `Please verify your email by clicking on the following link: http://localhost:3000/verify-email?token=${verificationToken}` // Adjust the URL as per your front-end route for email verification
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Verification email sent: ' + info.response);
      }
    });

    res.json(newUser.rows[0]);
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).send("Server error");
  } 
});



// for login 
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and if their email has been verified
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credentials or User Not Found.");
    }

    // Check if the user's email is verified
    if (!user.rows[0].email_verified) {
      return res.status(403).json("Please verify your email before logging in.");
    }

    // Check if submitted password matches the stored hash
    const validPassword = await bcrypt.compare(password, user.rows[0].encrypted_password);
    if (!validPassword) {
      return res.status(401).json("Invalid Credentials.");
    }

    // Generate and return JWT
    const token = jwt.sign({ id: user.rows[0].id }, "yourSecretKey", { expiresIn: "1h" }); // Remember to replace "yourSecretKey" with a real secret key, and preferably store it in an environment variable
    res.json({ username: user.rows[0].username, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



app.post('/forgot-password', async (req, res) => {
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
          text: `Hi ${user.rows[0].username},\n we have recieved your sign up request.\n http://localhost:3000/reset-password/${user.rows[0].id}/${token}`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            return res.send({Status: "Success"})
          }
        });
  
})

app.post('/reset-password/:id/:token', (req, res) => {
  const {id, token} = req.params
  const {password} = req.body

  try {
    jwt.verify(token, "jwt_secret_key", async (err, decoded) => {
      if(err) {
          return res.json({Status: "Error with token"})
      } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        // const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        await pool.query("UPDATE users SET encrypted_password = $1 WHERE id = $2", [hashedPassword, id]);
      }
  })}
  catch (error){
    res.send({Status: error})
  }
})

app.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    const user = await pool.query("SELECT * FROM users WHERE verification_token = $1", [token]);

    if (user.rows.length > 0) {
      await pool.query("UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE verification_token = $1", [token]);
      res.send("Email verified successfully.");
    } else {
      res.status(400).send("Invalid or expired verification token.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error during email verification.");
  }
});

app.listen(5000, () => {
  console.log("server has started on port 5000")
});