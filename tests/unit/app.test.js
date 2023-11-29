const request = require('supertest');
const app = require('../../src/app');

describe('App', () => {
    it('should serve static files from the public directory', async () => {
        const response = await request(app).get('/login.html');
        expect(response.status).toBe(200);
        expect(response.text).toContain('login');
    });

    it('should respond with a 404 status code for unknown routes', async () => {
        const response = await request(app).get('/unknown-route');
        expect(response.status).toBe(404);
    });
});

describe('Server', () => {
    let server;

    beforeAll(() => {
        server = app.listen(3001);
    });

    afterAll((done) => {
        server.close(done);
    });

    it('should listen on the specified port', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });
});