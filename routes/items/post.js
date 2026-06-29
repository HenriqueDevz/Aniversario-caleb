const express = require('express');
const router = express.Router();
const { db } = require('../../database');

router.post('/categories', async (req, res) => {
    const { name } = req.body;
    if(!name) {
        return res.status(400).json({ error: 'Name is category a obrigatory' });  
    }
    const result = await db.execute({
        sql: 'INSERT INTO categories (name)VALUES(?)',
        args: [name]
    })
    res.status(201).json({ id: Number(result.lastInsertRowid), name })
})

router.post('/items', async (req, res) => {
    const { category_id, name , quantity, notes } = req.body;
    if(!name || !category_id) {
        return res.status(400).json({ error: 'Name and category are obrigatory' });
    }
    const result = await db.execute({
        sql:'INSERT INTO items(category_id, name, quantity, notes) VALUES (?, ?, ?, ?)',
        args: [category_id, name, quantity || 1, notes || null]
    })
    res.status(201).json({ id: Number(result.lastInsertRowid), category_id, name, quantity:quantity || 1, notes: notes || null });
});

module.exports = router;