const express = require("express");
const router = express.Router();

const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'outreachbot@gmail.com',
      pass: 'nglteophfzobysfp' // It's recommended to use environment variables or OAuth2 for storing and accessing sensitive credentials
    }
  });

// sending outreach email
// router.post('/', async (req, res) => {
//     console.log("Here in backend");
//     try {
//         console.log("Received email request", req.body);
//         for (let i = 0; i < req.body.length; i++){
//             const { first_name, last_name,job_title , email } = req.body[i];
//             const source = fs.readFileSync('template.html', 'utf-8').toString();
//             const template = handlebars.compile(source);
//             const replacements = {
//               username: first_name + ' ' + last_name, //change to username
//             };
//             const htmlToSend = template(replacements);
          
//             const info = await transporter.sendMail({
//               from: 'outreachbot@gmail.com',
//               to: email, //change this to recipient email address
//               subject: 'Outreach Message',
//               text: 'Hello world?', // dont really need this but it is recommended to have a text property as well
//               html: htmlToSend
//             });
          
//             console.log('Message sent: %s', info.response);
//         }
//         const source = fs.readFileSync('template.html', 'utf-8').toString();
//         const template = handlebars.compile(source);
//         const replacements = {
//           username: "Pooja", //change to username
//         };
//         const htmlToSend = template(replacements);
      
//         const info = await transporter.sendMail({
//           from: 'outreachbot@gmail.com',
//           to: "poojappatel@umass.edu", //change this to recipient email address
//           subject: 'Outreach Message',
//           text: 'Hello world?', // dont really need this but it is recommended to have a text property as well
//           html: htmlToSend
//         });
//         console.log('Message sent: %s', info.response);
//         res.send('Emails Sent!');
//     } catch(error){
//     console.error('Sending email error:', error);
//     }
//   });
  
router.post('/', async (req, res) => {
  const { to, subject, body } = req.body;
  try {
      let info = await transporter.sendMail({
          from: 'outreachbot@gmail.com',
          to: 'cbouharb@umass.edu', //change to 'to' when sending actually
          subject: subject,
          html: body
      });
      console.log('Message sent: %s', info.response);
      res.send({ message: 'Email sent', info });
  } catch (error) {
      res.status(500).send({ message: 'Failed to send email', error });
  }
});
  module.exports = router;