const express = require('express');
const router = express.Router();
const db = require('../../database');

router.post('/guests', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name a guest is obrigatory' });
    }

    const stmt = db.prepare('INSERT INTO guests (name) VALUES (?)');
    const result = stmt.run(name);
    res.status(201).json({ id: result.lastInsertRowid, name, confirmed: 0 });
});

module.exports = router;