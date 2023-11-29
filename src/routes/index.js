const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/login.html'));
});

router.get('/login', (req, res) => {
    res.render('login', { message: req.flash('error') });
});

module.exports = router;