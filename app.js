require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index.js');
const authRouter = require('./routes/auth.js');

const app = express();

if (!process.env.EMBED_ID || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.EMBED_TYPE) {
  console.log('The following variables must be declared in your .env file: EMBED_ID, CLIENT_ID, CLIENT_SECRET, EMBED_TYPE.');
  process.exit(1);
}

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/', authRouter);

module.exports = app;