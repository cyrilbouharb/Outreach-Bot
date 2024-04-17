const express = require("express");
const router = express.Router();

const pool = require("../db");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uploadDirectory = 'ResumeUploads/';


const ensureUploadFolderExists = (dir) => {
    const resolvedDir = path.resolve(dir);
    if (!fs.existsSync(resolvedDir)) {
      fs.mkdirSync(resolvedDir, { recursive: true });
    }
  };
  
  ensureUploadFolderExists(uploadDirectory);
  
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, uploadDirectory);
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });
  
  
  
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  }
  
  
  
  
  
  router.post('/uploadResume', upload.single('resume'), async (req, res) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).send("No token provided, user must be logged in");
    }
  
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).send("Token is invalid or expired");
      }
  
      // If token is valid, proceed with the file upload process
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }
  
      const userId = user.id; // Assuming your JWT token payload includes the user ID
      try {
        const { path, originalname, mimetype, size } = req.file;
        
        const insertQuery = `
          INSERT INTO resumes (user_id, file_name, file_path, mime_type, size)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;
        
        console.log("Attempting to insert resume for user ID:", userId);
        
        const newResume = await pool.query(insertQuery, [userId, originalname, path, mimetype, size]);
        res.json({ message: "Resume uploaded successfully", file: newResume.rows[0] });
      } catch (error) {
        console.error('Upload Error:', error.message);
        res.status(500).send("Server error during file upload");
      }
    });
  });
  
  // hold off for now
  
  router.get('/api/resumes', async (req, res) => {
    try {
      const queryResult = await pool.query('SELECT id, file_name, file_path, mime_type, size, created_at, updated_at FROM resumes');
      const resumes = queryResult.rows.map(resume => ({
        ...resume,
        url: `http://localhost:5000/resumes/${resume.file_name}` // Assuming file_name stores the actual file's name on disk
      }));
      
      res.json(resumes);
    } catch (err) {
      console.error('Error fetching resumes:', err);
      res.status(500).send("Server error");
    }
  });

  module.exports = router;