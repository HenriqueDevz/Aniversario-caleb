const express = require('express');
const router = express.Router();
const { db } = require('../../database');

router.get('/categories', async (req, res) => {
    const result = await db.execute('SELECT * FROM categories')
    const categories = result.rows
    const categoriesWithItems = await Promise.all(categories.map(async category => {
        const itemsResult = await db.execute({
            sql: 'SELECT * FROM items WHERE category_id = ?',
            args: [category.id]
        })
        return { ...category, items: itemsResult.rows }
    }))
    res.json(categoriesWithItems)
})

module.exports = router