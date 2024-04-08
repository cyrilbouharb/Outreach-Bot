const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db")
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // Add this for generating UUIDs
const { body, validationResult } = require('express-validator');
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
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

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

const validateSignup = [
  body('username').trim().not().isEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

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



// app.post('/signup', validateSignup, async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

  try {
    console.log("Received signup request", req.body); 
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); 

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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

    const validPassword = await bcrypt.compare(password, user.rows[0].encrypted_password);
    if (!validPassword) {
      return res.status(401).json("Invalid Credentials.");
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.post('/uploadResume', authenticateToken, upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const userId = req.user.id;
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
