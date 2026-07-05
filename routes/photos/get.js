const express = require('express');
const router = express.Router();
const { db } = require('../../database');

router.get('/photos', async (req, res) => {
    const result = await db.execute('SELECT * FROM photos ORDER BY created_at DESC')
    res.json(result.rows)
})

module.exports = router;