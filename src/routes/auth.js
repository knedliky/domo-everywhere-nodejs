const axios = require('axios');
const express = require('express');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const LocalStrategy = require('passport-local');
const embed = require('../middleware/embed.js');
const findUser = require('../services/userService.js');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
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

const router = express.Router();

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/dashboard');
});

router.get('/dashboard', isAuthenticated, (req, res, next) => {
    fs.readFile(path.join(__dirname, '../../public/dashboard.html'), 'utf8', function (err, contents) {
        let newContents = contents.replace('Username', `${req.user.username}`);
        res.send(newContents);
    });
});

router.get('/embed/items/:itemId', isAuthenticated, (req, res, next) => {
    const config = req.user.config['visualization' + req.params.itemId];
    if (config.embedId) {
        embed.handleRequest(req, res, next, config);
    } else {
        next(`The EMBED_ID${req.params.itemId} environment variable in your .env file is not set. Please set this in order to view content here.`);
    }
});

router.get('/embed/page', isAuthenticated, (req, res, next) => {
    embed.showFilters(req, res);
});

router.get('/logout', isAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;