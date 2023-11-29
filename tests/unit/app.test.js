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

describe('Environment Variables', () => {
    let originalEnv;

    beforeAll(() => {
        originalEnv = process.env;
        process.env = {};
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should exit the process if required environment variables are missing', () => {
        const originalExit = process.exit;
        process.exit = jest.fn();

        app();

        expect(process.exit).toHaveBeenCalledWith(1);
        expect(console.log).toHaveBeenCalledWith('The following variables must be declared in your .env file: EMBED_ID, CLIENT_ID, CLIENT_SECRET, EMBED_TYPE, AUTH_DATASET_ID.');

        process.exit = originalExit;
    });

    it('should not exit the process if all required environment variables are present', () => {
        const originalExit = process.exit;
        process.exit = jest.fn();

        process.env.EMBED_ID = 'embed_id';
        process.env.CLIENT_ID = 'client_id';
        process.env.CLIENT_SECRET = 'client_secret';
        process.env.EMBED_TYPE = 'embed_type';
        process.env.AUTH_DATASET_ID = 'auth_dataset_id';

        app();

        expect(process.exit).not.toHaveBeenCalled();

        process.exit = originalExit;
    });
});