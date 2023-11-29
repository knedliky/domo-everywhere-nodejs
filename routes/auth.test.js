const request = require('supertest');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authRouter = require('./auth.js');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', authRouter);

// Mock user service
jest.mock('../services/userService.js', () => {
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
        const response = await request(app)
            .post('/login')
            .send({ username: 'test', password: 'password' });

        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/dashboard');
    });

    it('should redirect to /login after failed login', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: 'invaliduser', password: 'password' });

        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/login');
    });

    it('should render the dashboard page for authenticated user', async () => {
        const agent = request.agent(app);

        // Simulate successful login
        await agent
            .post('/login')
            .send({ username: 'test', password: 'password' });

        const response = await agent.get('/dashboard');

        expect(response.status).toBe(200);
        expect(response.text).toContain('test');
    });

    it('should redirect to /login for unauthenticated user accessing /dashboard', async () => {
        const response = await request(app).get('/dashboard');

        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/login');
    });
});