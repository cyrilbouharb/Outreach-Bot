const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db")
const nodemailer = require('nodemailer')

app.use(cors());
app.use(express.json());

//Routes//
const bcrypt = require('bcrypt');

// Assuming you have a users table with username, email, and hashed_password columns

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

    res.json(newUser.rows[0]);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Signup error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Signup error: No response', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Signup Error:', error.message);
    }
  }
  
});

const jwt = require('jsonwebtoken');

// for login 
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

app.listen(5000, () => {
  console.log("server has started on port 5000")
});