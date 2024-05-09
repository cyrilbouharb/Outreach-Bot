const request = require('supertest');
const express = require('express');
const pool = require('../db');

jest.mock('../db');

describe('Email Templates Route', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        const emailTemplatesRoute = require('../routes/Templates');
        app.use('/email-templates', emailTemplatesRoute);
    });

    test('should fetch all email templates successfully', async () => {
        // Mock the database query response
        const mockEmailTemplates = [
            { id: 1, name: 'Welcome Email', content: 'Welcome to our service!' },
            { id: 2, name: 'Reminder Email', content: 'Just a reminder about our service.' }
        ];
        pool.query.mockResolvedValueOnce({ rows: mockEmailTemplates });

        const response = await request(app).get('/email-templates');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockEmailTemplates);
    });

    test('should handle errors when fetching email templates fails', async () => {
        // Mock database query to throw an error
        const errorMessage = 'Failed to fetch data';
        pool.query.mockRejectedValueOnce(new Error(errorMessage));

        const response = await request(app).get('/email-templates');

        expect(response.status).toBe(500);
        expect(response.text).toContain(errorMessage);
    });
});
