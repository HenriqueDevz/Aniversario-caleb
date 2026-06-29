const express = require('express');
const router = express.Router();
const { db } = require('../../database');

router.post('/guests', async (req, res) => {
    const { name } = req.body;
    if (!name) 
        return res.status(400).json({ error: 'Name a guest is obrigatory' });
    const result = await db.execute({
        sql: 'INSERT INTO guests (name) VALUES (?)',
        args: [name]
    })
    res.status(201).json({ id: Number(result.lastInsertRowid), name, confirmed:0 })
})

module.exports = router;