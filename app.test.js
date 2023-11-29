const request = require('supertest');
const app = require('./app.js');

describe('App', () => {
    it('should return a 404 status code for unknown routes', async () => {
        const response = await request(app).get('/unknown-route');
        expect(response.status).toBe(404);
    });

    it('should return a 200 status code for the home route', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });
});