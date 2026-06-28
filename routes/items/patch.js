const express = require('express');
const router = express.Router();
const db = require('../../database');

router.patch('/items/:id/check', (req, res) => {
    const { id } = req.params;
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);

    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    const newChecked = item.checked === 0 ? 1 : 0;
    db.prepare('UPDATE items SET checked = ? WHERE id = ?').run(newChecked, id);
    res.json ({ ...item, checked: newChecked });
});

module.exports = router;