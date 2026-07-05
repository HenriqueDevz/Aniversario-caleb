const express = require('express');
const router = express.Router();
const { db } = require('../../database');

router.get ('/photo-categories', async (req, res) => {
    const result = await db.execute('SELECT * FROM photo_categories')
    const categories = result.rows

    const categoriesWithPhotos = await Promise.all(categories.map(async category => {
        const photosResult = await db.execute({
            sql: 'SELECT * FROM photos WHERE photo_category_id = ? ORDER BY created_at ASC',
            args: [category.id]
        })
        return { ...category, photos: photosResult.rows }
    }))
    res.json(categoriesWithPhotos)
});

router.post('/photo-categories', async (req, res) => {
    const { name } = req.body
    if (!name) 
        return res.status(400).json({ error: 'Name of category is obrigatory' })

    const result = await db.execute({
        sql: 'INSERT INTO photo_categories (name) VALUES (?)',
        args: [name]
    })
    res.status(201).json({ id: Number(result.lastInsertRowid),name })
});

router.delete('/photo-categories/:id', async (req, res) => {
    const { id } = req.params
    const categoryResult = await db.execute({
        sql: 'SELECT * FROM photo_categories WHERE id = ?',
        args: [id]
    })
    const category = categoryResult.rows[0]
    if (!category)
        return res.status(404).json({ error: 'Category not found' })
    await db.execute({
        sql: 'DELETE FROM photos WHERE photo_category_id = ?',
        args : [id]
    })
    await db.execute({
        sql: 'DELETE FROM photo_categories WHERE id = ?',
        args: [id]
    })
    res.json({ message: 'Category deleted a sucessfully '})
})

module.exports = router;