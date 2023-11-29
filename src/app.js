require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index.js');
const authRouter = require('./routes/auth.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

app.use('/', [indexRouter, authRouter]);

module.exports = app;