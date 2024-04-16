const request = require('supertest');
// const app = require('../../client/src/App.js');
// const app = require('../../server/Index.js');
// const express = require("express");
// const app = express();

const createApp = require('../index');
const app = createApp();

// const { signInHandler, signUpHandler } = require('../src/routes/auth');

// Mock data for sign-in and sign-up
// Test user data for signup
const signUpData = {
username: 'yunis',
email: 'yegal@umass.edu',
password: 'pwd123@321',
};

// Test user data for login
const signInData  = {
email: 'adeebshaik120@gmail.com',
password: 'pwd321',
};

// Test for sign-up
test('POST /signup', async () => {
  const response = await request(app)
    .post('/signup')
    .send(signUpData);

  expect(response.statusCode).toBe(200);
});

// Test for sign-in
test('POST /login', async () => {
  const response = await request(app)
    .post('/login')
    .send(signInData);
  expect(response.statusCode).toBe(200);
});

// describe('Authentication Endpoints', () => {
//   let server;
//   let token; // Will store the JWT token for authenticated requests

//   beforeAll(async () => {
//     server = await app.listen(5000);
//     console.log("Server started on port 5000");
//   });

//   afterAll(async () => {
//     await server.close();
//     console.log("Server stopped");
//   });

//   // Test user data for signup
//   const userData = {
//     username: 'yunis',
//     email: 'yegal@umass.edu',
//     password: 'pwd123@321',
//   };

//   // Test user data for login
//   const loginData = {
//     email: 'adeebshaik120@gmail.com',
//     password: 'pwd321',
//   };

//   // Test signup endpoint
//   describe('POST /signup', () => {
//     it('should create a new user', async () => {
//       const res = await request(app)
//         .post('/signup')
//         .send(userData)
//         .expect(200);

//       expect(res.body).toHaveProperty('username', userData.username);
//       expect(res.body).toHaveProperty('email', userData.email);
//       expect(res.body).toHaveProperty('id');
//     });

//     it('should return error if user already exists', async () => {
//       const res = await request(app)
//         .post('/signup')
//         .send(userData)
//         .expect(500); // Assuming server returns 500 for duplicate user error

//       expect(res.body).toHaveProperty('error');
//     });
//   });

//   // Test login endpoint
//   describe('POST /login', () => {
//     it('should authenticate user and return JWT token', async () => {
//       const res = await request(app)
//         .post('/login')
//         .send(loginData)
//         .expect(200);

//       expect(res.body).toHaveProperty('username', userData.username);
//       expect(res.body).toHaveProperty('token');
//       token = res.body.token; // Store token for authenticated requests
//     });

//     it('should return error for invalid credentials', async () => {
//       const res = await request(app)
//         .post('/login')
//         .send({ email: 'wrong@example.com', password: 'wrongpassword' })
//         .expect(401);

//       expect(res.body).toBe('Invalid Credential');
//     });
//   });

//   // Test authenticated route
//   describe('GET /welcome', () => {
//     it('should return welcome message for authenticated user', async () => {
//       const res = await request(app)
//         .get('/welcome')
//         .set('Authorization', `Bearer ${token}`)
//         .expect(200);

//       expect(res.text).toBe(`Welcome ${userData.username}`);
//     });

//     it('should return unauthorized error for unauthenticated user', async () => {
//       const res = await request(app)
//         .get('/welcome')
//         .expect(401);

//       expect(res.body).toHaveProperty('error');
//     });
//   });
// });

