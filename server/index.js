const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db")
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

require('dotenv').config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

const bcrypt = require('bcrypt');

const validateSignup = [
  body('username').trim().not().isEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!authHeader){
    return res.status(401).json({error: "No authorization header provided"})
  }
  if (!token) {
    return res.sendStatus(401).json({ error: "Bearer token not provided" });
  }

  const query = "SELECT * FROM blacklisted_tokens WHERE token = $1";
  pool.query(query, [token], (err, result) => {
    if (err){
      return res.status(500).send("Database error");
    }

    if (result.rows.length > 0){
      return res.sendStatus(403);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err){
        return res.sendStatus(403).json({ error: "Invalid or expired token" });
      }
      req.user = user;
      next();
    });
  });
}

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

app.post('/logout', authenticateToken, (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }

  const decodedToken = jwt.decode(token);
  const expiresAt = new Date(decodedToken.exp * 1000);

  const insertQuery = "INSERT INTO blacklisted_tokens (token, expires_at) VALUES ($1, $2) ON CONFLICT DO NOTHING";
  pool.query(insertQuery, [token, expiresAt], (err, result) => {
    if (err) {
      console.error('Database error during logout:', err);
      return res.status(500).send("Server error during logout");
    }
    res.json({ message: "Logged out successfully" });
  });
});


app.post('/uploadResume', authenticateToken, upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const userId = req.user.id;
  const file = req.file;
  const key = `resumes/${Date.now()}-${file.originalname}`;

  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  });

  try {
    const {originalname, mimetype, size } = req.file;
    const insertQuery = `
      INSERT INTO resumes (user_id, file_name, file_path, mime_type, size)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const newResume = await pool.query(insertQuery, [userId, originalname, key, mimetype, size]);
    res.json({ message: "Resume uploaded successfully", file: newResume.rows[0]});
  } catch (error) {
    console.error('Upload Error:', error.message);
    res.status(500).send("Server error during file upload");
  }
});


setInterval(() =>{
  const cleanQuery = "DELETE FROM blacklisted_tokens WHERE expires_at < NOW()";
  pool.query(cleanQuery, (err, result) => {
    if (err) {
      console.error('Error cleaning up blacklisted tokens:', err);
      return;
    }
    console.log("Expired blacklisted tokens cleaned up");
  });
}, 3600000);


app.listen(5000, () => {
    console.log("server has started on port 5000")
});

