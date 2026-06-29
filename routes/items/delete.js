const express = require('express');
const router = express.Router();
const { db } = require('../../database');

router.delete('/items/:id', async (req, res) => {
    const { id } = req.params;
    const itemResult = await db.execute({
        sql: 'SELECT * FROM items WHERE id = ?',
        args: [id]
    })
    const item = itemResult.rows[0]
    if (!item)
        return res.status(404).json({ error: 'Item not found' });
    await db.execute({
        sql: 'DELETE FROM items WHERE id = ?',
        args: [id]
    })
    res.json({ message: 'Item deleted successfully' });
});

router.delete('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const categoryResult = await db.execute({
        sql: 'SELECT * FROM categories WHERE id = ?',
        args:[id]
    })
    const category = categoryResult.rows[0]
    if (!category)
        return res.status(404).json({ error: 'Category not found' });

    await db.execute({
        sql: 'DELETE FROM items WHERE category_id = ?',
        args: [id]
    })
    await db.execute({
        sql: 'DELETE FROM categories WHERE id = ?',
        args: [id]
    })
    res.json({ message: 'Category and its items deleted successfully' });
});

module.exports = router;