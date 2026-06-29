const express = require('express');
const router = express.Router();
const { db } = require('../../database');

router.delete('/guests/:id', async (req, res) => {
    const { id } = req.params
    const guestResult = await db.execute({
        sql: 'SELECT * FROM guests WHERE id = ?',
        args: [id]
    })
    const guest = guestResult.rows[0]
    if (!guest) 
        return res.status(404).json({ error: 'Guest not found'});
    await db.execute({
        sql: 'DELETE FROM guests WHERE id = ?',
        args: [id]
    })
    res.json({ message: 'Guest deleted sucessfully'})
})

module.exports = router