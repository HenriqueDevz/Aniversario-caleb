const express = require('express');
const router = express.Router();
const db = require('../../database');

router.post('/categories', (req, res) => {
    const { name } = req.body;
    if(!name) {
        return res.status(400).json({ error: 'Name is category a obrigatory' });  
    }

    const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
    const result = stmt.run(name);
    res.status(201).json({  id: result.lastInsertRowid, name });
});

router.post('/items', (req, res) => {
    const { category_id, name , quantity, notes } = req.body;
    if(!name || !category_id) {
        return res.status(400).json({ error: 'Name and category are obrigatory' });
    }

    const stmt = db.prepare('INSERT INTO items (category_id, name , quantity, notes) VALUES (?, ?, ?, ?)');
    const result = stmt.run(category_id, name, quantity || 1, notes || null);
    res.status(201).json({ id: result.lastInsertRowid, category_id, name, quantity:quantity || 1, notes: notes || null });
});

module.exports = router;