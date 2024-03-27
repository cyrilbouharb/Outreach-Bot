const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db")
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
app.use(cors());
app.use(express.json());

//Routes//
const bcrypt = require('bcrypt');

const validateSignup = [
  body('username').trim().not().isEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

app.post('/signup', validateSignup, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    console.log("Received signup request", req.body); 
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); 

    const newUser = await pool.query(
      "INSERT INTO users (username, email, encrypted_password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    res.json(newUser.rows[0]);
  } catch (error) {
    console.error('Signup Error:', error.message);
    res.status(500).send("Server error");
  }
  
});

app.post('/login', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].encrypted_password);

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.listen(5000, () => {
    console.log("server has started on port 5000")
});

