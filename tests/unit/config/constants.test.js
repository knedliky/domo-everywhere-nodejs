const constants = require('../../../src/config/constants');

describe('Constants', () => {
    it('should have the correct API_HOST value', () => {
        expect(constants.API_HOST).toBe('https://api.domo.com');
    });

    it('should have the correct EMBED_HOST value', () => {
        expect(constants.EMBED_HOST).toBe('https://public.domo.com');
    });

    it('should have the correct ACCESS_TOKEN_URL value', () => {
        expect(constants.ACCESS_TOKEN_URL).toBe('https://api.domo.com/oauth/token?grant_type=client_credentials&scope=data%20audit%20user%20dashboard');
    });

    it('should have the correct EMBED_TOKEN_URL_DASHBOARD value', () => {
        expect(constants.EMBED_TOKEN_URL_DASHBOARD).toBe('https://api.domo.com/v1/stories/embed/auth');
    });

    it('should have the correct EMBED_URL_DASHBOARD value', () => {
        expect(constants.EMBED_URL_DASHBOARD).toBe('https://public.domo.com/embed/pages/');
    });

    it('should have the correct EMBED_TOKEN_URL_CARD value', () => {
        expect(constants.EMBED_TOKEN_URL_CARD).toBe('https://api.domo.com/v1/cards/embed/auth');
    });

    it('should have the correct EMBED_URL_CARD value', () => {
        expect(constants.EMBED_URL_CARD).toBe('https://public.domo.com/cards/');
    });

    it('should have the correct EMBED_TOKEN_URL value based on EMBED_TYPE', () => {
        if (process.env.EMBED_TYPE === 'card') {
            expect(constants.EMBED_TOKEN_URL).toBe(constants.EMBED_TOKEN_URL_CARD);
        }
        if (process.env.EMBED_TYPE === 'dashboard') {
            expect(constants.EMBED_TOKEN_URL).toBe(constants.EMBED_TOKEN_URL_DASHBOARD);
        }
    });

    it('should have the correct EMBED_URL value based on EMBED_TYPE', () => {
        if (process.env.EMBED_TYPE === 'card') {
            expect(constants.EMBED_URL).toBe(constants.EMBED_URL_CARD);
        }
        if (process.env.EMBED_TYPE === 'dashboard') {
            expect(constants.EMBED_URL).toBe(constants.EMBED_URL_DASHBOARD);
        }
    });
});