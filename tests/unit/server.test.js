const app = require('../../src/app');
const request = require('supertest');

describe('Server', () => {
    let server;

    beforeAll(() => {
        server = app.listen(0);
    });

    afterAll((done) => {
        server.close(done);
    });

    it('should return a 200 status code for the root path', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });

    it('should return a 404 status code for unknown routes', async () => {
        const response = await request(app).get('/unknown-route');
        expect(response.status).toBe(404);
    });
});