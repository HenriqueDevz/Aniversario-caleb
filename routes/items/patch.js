const express = require('express');
const router = express.Router();
const { db } = require('../../database');

router.patch('/items/:id/check', async (req, res) => {
    const { id } = req.params;
    const itemResult = await db.execute({
        sql:'SELECT * FROM items WHERE id = ?',
        args:[id]
    })
    const item = itemResult.rows[0]
    if(!item) return res.status(404).json({ error: 'Item not found'})
    const newChecked = item.checked === 0 ? 1 : 0
    await db.execute({
        sql: 'UPDATE items SET checked = ? WHERE id = ?',
        args: [newChecked, id]
    })
    res.json({ ...item, checked: newChecked })
    })

module.exports = router