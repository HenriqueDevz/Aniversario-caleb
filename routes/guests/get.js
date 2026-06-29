const express = require('express');
const router = express.Router();
const { db } = require('../../database');

router.get('/guests', async (req, res) => {
    const result = await db.execute('SELECT * FROM guests')
    res.json(result.rows);
});

module.exports = router;
