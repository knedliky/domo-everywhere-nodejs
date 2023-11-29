const request = require('supertest');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authRouter = require('../../../src/routes/auth.js');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', authRouter);

// Mock user service
jest.mock('../../../src/services/userService.js', () => {
    return jest.fn().mockImplementation((username, cb) => {
        if (username === 'test') {
            cb(null, { username: 'test' });
        } else {
            cb(null, null);
        }
    });
});

describe('Authentication Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should redirect to /dashboard after successful login', async () => {
        const formData = new URLSearchParams();
        formData.append('username', 'test');
        formData.append('password', 'password');

        const response = await request(app)
            .post('/login')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send(formData.toString());

        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/dashboard');
    });

    it('should redirect to /login after failed login', async () => {
        const formData = new URLSearchParams();
        formData.append('username', 'invaliduser');
        formData.append('password', 'password');

        const response = await request(app)
            .post('/login')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send(formData.toString());

        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/login');
    });

    it('should render the dashboard page for authenticated user', async () => {
        const agent = request.agent(app);

        const formData = new URLSearchParams();
        formData.append('username', 'test');
        formData.append('password', 'password');

        // Simulate successful login
        await agent
            .post('/login')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send(formData.toString());

        const response = await agent.get('/dashboard');

        expect(response.status).toBe(200);
        expect(response.text).toContain('embed-container');
    });

    it('should redirect to /login for unauthenticated user accessing /dashboard', async () => {
        const response = await request(app).get('/dashboard');

        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/login');
    });
});