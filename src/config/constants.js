const API_HOST = 'https://api.domo.com';
const EMBED_HOST = 'https://public.domo.com';
const ACCESS_TOKEN_URL = `${API_HOST}/oauth/token?grant_type=client_credentials&scope=data%20audit%20user%20dashboard`;
const EMBED_TOKEN_URL_DASHBOARD = `${API_HOST}/v1/stories/embed/auth`;
const EMBED_URL_DASHBOARD = `${EMBED_HOST}/embed/pages/`;
const EMBED_TOKEN_URL_CARD = `${API_HOST}/v1/cards/embed/auth`;
const EMBED_URL_CARD = `${EMBED_HOST}/cards/`;

let EMBED_TOKEN_URL;
let EMBED_URL;

if (process.env.EMBED_TYPE === 'dashboard') {
    EMBED_TOKEN_URL = EMBED_TOKEN_URL_DASHBOARD;
    EMBED_URL = EMBED_URL_DASHBOARD;
}

if (process.env.EMBED_TYPE === 'card') {
    EMBED_TOKEN_URL = EMBED_TOKEN_URL_CARD;
    EMBED_URL = EMBED_URL_CARD;
}

module.exports = {
    API_HOST,
    EMBED_HOST,
    ACCESS_TOKEN_URL,
    EMBED_TOKEN_URL_DASHBOARD,
    EMBED_URL_DASHBOARD,
    EMBED_TOKEN_URL_CARD,
    EMBED_URL_CARD,
    EMBED_TOKEN_URL,
    EMBED_URL
}