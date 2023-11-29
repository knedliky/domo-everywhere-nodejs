const request = require('supertest');
const express = require('express');
const path = require('path');
const router = require('./index.js');

const app = express();
app.use('/', router);

describe('Index Routes', () => {
    it('should return the login page for the root route', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('login');
    });
});