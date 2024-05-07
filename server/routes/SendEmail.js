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

  let personArr = [];


//sending outreach email
router.post('/userinfo', async (req, res) => {
    console.log("Here in backend");
    try {
        console.log("Received email request", req.body);
        personArr = [];
        for (let i = 0; i < req.body.length; i++){
            const { first_name, last_name,job_title , email } = req.body[i];
            //const source = fs.readFileSync('template.html', 'utf-8').toString();
            //const template = handlebars.compile(source);
            const person = {first_name: first_name, last_name: last_name, email: email};
            personArr.push(person);
            // const replacements = {
            //   username: first_name + ' ' + last_name, //change to username
            // };
            //const htmlToSend = template(replacements);
          
            // const info = await transporter.sendMail({
            //   from: 'outreachbot@gmail.com',
            //   to: email, //change this to recipient email address
            //   subject: 'Outreach Message',
            //   text: 'Hello world?', // dont really need this but it is recommended to have a text property as well
            //   html: htmlToSend
            // });
          
            // console.log('Message sent: %s', info.response);
        }
        res.status(200).end();
        // const source = fs.readFileSync('template.html', 'utf-8').toString();
        // const template = handlebars.compile(source);
        // const replacements = {
        //   username: "Pooja", //change to username
        // };
        // const htmlToSend = template(replacements);
      
        // const info = await transporter.sendMail({
        //   from: 'outreachbot@gmail.com',
        //   to: "poojappatel@umass.edu", //change this to recipient email address
        //   subject: 'Outreach Message',
        //   text: 'Hello world?', // dont really need this but it is recommended to have a text property as well
        //   html: htmlToSend
        // });
        // console.log('Message sent: %s', info.response);
        // res.send('Emails Sent!');
    } catch(error){
    console.error('Error retrieving outreach candidates:', error);
    }
  });
  
router.post('/sendEmail', async (req, res) => {
  var { subject, body } = req.body;

  try {
    for (let i =0; i<personArr.length; ++i){
      let modifiedBody = ("Dear " + personArr[i].first_name + " " + personArr[i].last_name + ", " + body);
          let info = await transporter.sendMail({
          from: 'outreachbot@gmail.com',
          to: personArr[i].email,
          //to: 'cbouharb@umass.edu', //change to 'to' when sending actually
          subject: subject,
          html: modifiedBody
      });
      console.log('Message sent: %s', info.response);
    }
      res.send({ message: 'Emails sent!'});
  } catch (error) {
      res.status(500).send({ message: 'Failed to send email', error });
  }
});
  module.exports = router;