const express = require('express');
const router = express.Router();
const db = require('../../database');

router.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);

    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    db.prepare('DELETE FROM items WHERE id = ?').run(id);
    res.json({ message: 'Item deleted successfully' });
});

router.delete('/categories/:id', (req, res) => {
    const { id } = req.params;
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    if (!category) {
        return res.status(404).json({ error: 'Category not found' });
    }
    db.prepare('DELETE FROM items WHERE category_id = ?').run(id);
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    res.json({ message: 'Category and its items deleted successfully' });
});

module.exports = router;