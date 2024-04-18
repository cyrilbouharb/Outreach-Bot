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
const handlebars = require('handlebars');
const uploadDirectory = 'ResumeUploads/';
// app.use('/resumes', express.static('ResumeUploads'));
const axios = require('axios');

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use('/resumes', express.static('ResumeUploads'));

const userRoute = require("./routes/Users");
const searchRoute = require("./routes/Search");
const sendEmailRoute = require("./routes/SendEmail");
const documentRoute = require("./routes/Documents");

app.use('/users', userRoute);
app.use('/search', searchRoute);
app.use('/send', sendEmailRoute);
app.use('/documents', documentRoute);

module.exports = app;

app.listen(5000, () => {
  console.log("server has started on port 5000")
});
