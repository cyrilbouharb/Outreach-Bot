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
        console.log(personArr);
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
      const replacements = {
               username: personArr[i].first_name + ' ' + personArr[i].last_name,
               body: body
             };
      const htmlToSend = template(replacements);
      // let modifiedBody = ("Dear " + personArr[i].first_name + " " + personArr[i].last_name + ", \n \n" + body);
          let info = await transporter.sendMail({
          from: 'outreachbot@gmail.com',
          to: personArr[i].email,
          //to: 'cpickreign@umass.edu', //change to 'to' when sending actually
          subject: subject,
          html: htmlToSend
      });
      console.log('Message sent: %s', info.response);
    }
      res.send({ message: 'Emails sent!'});
  } catch (error) {
      res.status(500).send({ message: 'Failed to send email', error });
  }
});
function template(replacements) {
  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #333;
            font-size: 24px;
            margin: 0;
        }
        .content {
            margin-bottom: 30px;
        }
        .content p {
            margin: 0 0 10px;
            line-height: 1.5;
        }
        .footer {
            text-align: center;
        }
        .footer p {
            color: #999;
            font-size: 14px;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Dear, ${replacements.username}!</h1>
        </div>
        <div class="content">
            <p>${replacements.body}</p>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <p>OutreachBot</p>
        </div>
    </div>
</body>
</html>`;
}

  module.exports = router;