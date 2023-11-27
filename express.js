require('dotenv').config();
const axios = require('axios');
const express = require('express')
const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const path = require('path');
const fs = require('fs');
const embed = require('./middleware/embed.js');
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: false
}))
const yargs = require('yargs');
const { ACCESS_TOKEN_URL } = require('./config/constants.js');

const argv = yargs
  .option('port', {
    alias: 'p',
    description: 'Specify which port to listen on',
    default: 3001,
    type: 'number',
  })
  .help()
  .alias('help', 'h')
  .argv;

async function getUsers() {
  try {
    const response = await axios.get(ACCESS_TOKEN_URL, {
      headers: {
        "Authorization": "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64")
      }
    });
    const accessToken = response.data.access_token;
    const datasetResponse = await axios.post(`https://api.domo.com/v1/datasets/query/execute/${process.env.AUTH_DATASET_ID}`, {
      "sql": "SELECT * FROM table"
    }, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": 'application/json',
        "Accept": 'application/json',
      },
    });
    const columnNames = datasetResponse.data.columns;
    const data = datasetResponse.data.rows;

    const users = data.map(row => {
      const user = row[columnNames.indexOf('username')];
      const embed_id = row[columnNames.indexOf('embed_id')];
      const column = row[columnNames.indexOf('column')];
      const operator = row[columnNames.indexOf('operator')];
      const values = row[columnNames.indexOf('values')].split(',').map(value => value.trim());

      return {
        username: user,
        config: {
          visualization1: {
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            embedId: embed_id,
            filters: [{
              "column": column,
              "operator": operator,
              "values": values
            }]
          },
        }
      }
    });
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function findUser(username, callback) {
  const users = await getUsers();
  const user = users.find(user => {
    return user.username === username
  })
  if (user) {
    return callback(null, user)
  }
  return callback(null)
}

passport.serializeUser(function (user, cb) {
  cb(null, user.username)
})

passport.deserializeUser(function (username, cb) {
  findUser(username, cb)
})

passport.use(new LocalStrategy(
  function (username, password, done) {
    findUser(username, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user);
    });
  }
));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
  }
}

passport.authenticationMiddleware = authenticationMiddleware;

if (!process.env.EMBED_ID || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.EMBED_TYPE) {
  console.log('The following variables must be declared in your .env file: EMBED_ID, CLIENT_ID, CLIENT_SECRET, EMBED_TYPE.');
  return;
}

app.get('/embed/items/:itemId', passport.authenticationMiddleware(), (req, res, next) => {
  const config = req.user.config['visualization' + req.params.itemId];
  if (config.embedId) {
    embed.handleRequest(req, res, next, req.user.config['visualization' + req.params.itemId]);
  } else {
    next(`The EMBED_ID${req.params.itemId} environment variable in your .env file is not set. Please set this in order to view content here.`);
  }
});

app.get('/embed/page', passport.authenticationMiddleware(), (req, res, next) => {
  embed.showFilters(req, res);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
})

app.get('/login', function (req, res) {
  res.render('login', { message: req.flash('error') });
});

app.post('/login', passport.authenticate('local', { failureFlash: true }), function (req, res) {
  res.redirect('/dashboard');
});

app.get('/sso', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashboard_sso.html'));
})

app.get('/dashboard', passport.authenticationMiddleware(), (req, res, next) => {
  fs.readFile(path.join(__dirname, process.env.USE_XHR === 'true' ? 'public/dashboard_xhr.html' : 'public/dashboard.html'), 'utf8', function (err, contents) {
    let newContents = contents.replace('Username', `${req.user.username}`);
    newContents = newContents.replace('REPLACE_IFRAME_FROM_ENV', process.env.REPLACE_IFRAME);
    res.send(newContents);
  });
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.use(express.static('public'))

app.listen(argv.port, () => console.log(`Example app listening on port ${argv.port}!`))
