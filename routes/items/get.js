const express = require('express');
const router = express.Router();
const db = require('../../database');

router.get('/categories', (req, res) => {
    const categories = db.prepare('SELECT * FROM categories').all();
    const result = categories.map(category => {
        const items = db.prepare('SELECT * FROM items WHERE category_id = ?').all(category.id);
        return { ...category, items };
    });
    res.json(result);
});

module.exports = router;