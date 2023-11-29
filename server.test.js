const app = require('./app.js');
const request = require('supertest');

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