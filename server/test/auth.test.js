const request = require('supertest');
// const app = require('../../client/src/App.js');
// const app = require('../../server/Index.js');
// const express = require("express");
// const app = express();

const createApp = require('../index');
// const createApp = require('../routes/Users.js');
// const app = createApp();
const app = require('../index');
// const app = require('../routes/Users.js');

// Test for sign-up
test('POST /signup should create a new user and return with status code 200', async () => {

  // Mock data for sign-up
  // Test user data for signup, change yunis email and add one after running tests
  const signUpData = {
    username: 'yunis',
    email: 'yegal+6@umass.edu',
    password: 'pwd123@321',
  };

  const response = await request(app)
    .post('/users/signup')
    .send(signUpData);
  expect(response.statusCode).toBe(200);
});

// Test for sign-in
test('POST /login should enable a user to login and reutnr with status code 200', async () => {

  // Test user data for login
  const signInData  = {
    email: 'adeebshaik120+1@gmail.com',
    password: 'pwd123321',
  };

  const response = await request(app)
    .post('/users/login')
    .send(signInData);
  expect(response.statusCode).toBe(200);
});


