const request = require('supertest');
const app = require('../index');
const pool = require('../db');
const jwt = require('jsonwebtoken');


describe('User Registration, Verification, and Login Flow', () => {
  // using verificationToken to store verification token
  let verificationToken;
  let resetToken;
  // Generating a unique email each time the test is run for testing
  let userEmail = `test+${Date.now()}@example.com`;

  test('POST /signup should register a user and return status code 200', async () => {
    const signUpData = {
      first_name: 'Test',
      last_name: 'User',
      email: userEmail,
      password: 'StrongPassword123',
    };

    const response = await request(app)
      .post('/users/signup')
      .send(signUpData);
    expect(response.statusCode).toBe(200);

    const dbResponse = await pool.query("SELECT verification_token FROM users WHERE email = $1", [userEmail]);
    verificationToken = dbResponse.rows[0].verification_token;
    // Ensure a token is retrieved
    expect(dbResponse.rows.length).toBe(1);
  });

  test('GET /verify-email should verify user email', async () => {
    const verifyResponse = await request(app)
      .get(`/users/verify-email?token=${verificationToken}`);

    expect(verifyResponse.text).toBe("Email verified successfully.");
    expect(verifyResponse.statusCode).toBe(200);

    // Confirm the email verification status in the database
    const dbResponse = await pool.query("SELECT email_verified FROM users WHERE email = $1", [userEmail]);
    // Check if the email is marked as verified
    expect(dbResponse.rows[0].email_verified).toBe(true);
  });

  test('POST /login should enable a verified user to login and return with status code 200', async () => {
    const loginData = {
      email: userEmail,
      password: 'StrongPassword123',
    };

    const response = await request(app)
      .post('/users/login')
      .send(loginData);
    
    expect(response.statusCode).toBe(200);
    // Check if the login response includes a token
    expect(response.body).toHaveProperty('token');
  });

  test('POST /forgot-password should simulate sending a reset link', async () => {
    // Mock the process of sending an email and generating a token
    resetToken = jwt.sign({id: 'mock-user-id'}, process.env.JWT_SECRET, {expiresIn: '1d'}); // Simulate token generation as it would occur in the route

    const response = await request(app)
        .post('/users/forgot-password')
        .send({ email: userEmail });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('Status', 'Success');
  }, 10000);

  test('POST /reset-password should allow a user to reset their password', async () => {
    // Locate the user from the previous tests
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [userEmail]);
    const userId = user.rows[0].id; 

    // Generate a valid token with the correct ID
    const resetToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const newPassword = 'newPassword123';
    const resetResponse = await request(app)
      .post('/users/reset-password')
      .query({ userId, token: resetToken }) // Update: Pass userId and token as query parameters 
      .send({ password: newPassword });  

    console.log('Reset Password Response:', resetResponse.body); 

    expect(resetResponse.statusCode).toBe(200);
    expect(resetResponse.body).toHaveProperty('message', 'Password updated successfully');

    // Verify the new password by attempting to log in
    const loginResponse = await request(app)
      .post('/users/login')
      .send({
        email: userEmail,
        password: newPassword,
      });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
  });

  
});
