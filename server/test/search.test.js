const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const router = require('../routes/Search');

jest.mock('axios');

describe('Search Route Tests', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/', router);
    });

    test('should return "Authentication failed" when authentication fails', async () => {
        axios.get.mockRejectedValueOnce(new Error('Authentication failed'));
        const response = await request(app)
            .post('/')
            .send({ organization: 'Test Org', location: 'Test Location', title: 'Test Title' });

        expect(response.status).toBe(401);
        expect(response.text).toContain('Authentication failed');
    });

    test('should return "No candidates found, try again" when no people are found', async () => {
        axios.get.mockResolvedValueOnce({ data: { message: 'Authentication success' } });
        axios.post.mockResolvedValueOnce({ data: { people: [], pagination: { total_entries: 0 } } });
    
        const response = await request(app)
            .post('/')
            .send({ organization: 'Test Org', location: 'Test Location', title: 'Test Title' });
    
        expect(response.status).toBe(200);
        // Ensure the response is checking for a JSON object with the correct message
        expect(response.body.message).toBe('No candidates found, try again');
    });
    

    test('should return the list of people when search is successful', async () => {
        axios.get.mockResolvedValueOnce({ data: { message: 'Authentication success' } });
        axios.post.mockResolvedValueOnce({
            data: {
                people: [
                    { id: '1', email_status: 'verified' }
                ],
                pagination: { total_entries: 1 }
            }
        });
        axios.post.mockResolvedValueOnce({ data: { person: { email: 'test@example.com' } } });

        const response = await request(app)
            .post('/')
            .send({ organization: 'Test Org', location: 'Test Location', title: 'Test Title' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { id: '1', email: 'test@example.com', email_status: 'verified' }
        ]);
    });

    test('should handle errors in the search route', async () => {
        axios.get.mockResolvedValueOnce({ data: { message: 'Authentication success' } });
        axios.post.mockRejectedValueOnce(new Error('API error'));

        const response = await request(app)
            .post('/')
            .send({ organization: 'Test Org', location: 'Test Location', title: 'Test Title' });

        expect(response.status).toBe(500);
        expect(response.text).toContain('An error occurred while processing your request');
    });
});
