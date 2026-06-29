const express = require('express');
const router = express.Router();
const { db } = require('../../database');

router.patch('/guests/:id/confirm', async (req, res) => {
    const { id } = req.params;
    const guestResult = await db.execute({
        sql: 'SELECT * FROM guests WHERE id = ?',
        args: [id]
    })
    const guest = guestResult.rows[0]
    if (!guest) 
        return res.status(404).json({ error: 'Guest not found' });
    const newConfirmed = guest.confirmed === 0 ? 1 : 0;
    await db.execute({
        sql: 'UPDATE guests SET confirmed = ? WHERE id = ?',
        args: [newConfirmed, id]
    })
    res.json({ ...guest, confirmed: newConfirmed })
});

module.exports = router
