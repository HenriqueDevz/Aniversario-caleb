const express = require('express');
const router = express.Router();
const db = require('../../database');

router.get('/guests', (req, res) => {
    const guests = db.prepare('SELECT * FROM guests').all();
    res.json(guests);
});

module.exports = router;
