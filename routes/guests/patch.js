const express = require('express');
const router = express.Router();
const db = require('../../database');

router.patch('/guests/:id/confirm', (req, res) => {
    const { id } = req.params;
    const guest = db.prepare('SELECT * FROM guests WHERE id = ?').get(id);
    if (!guest) {
        return res.status(404).json({ error: 'Guest not found' });
    }
    
    const newConfirmed = guest.confirmed === 0 ? 1 : 0;
    db.prepare('UPDATE guests SET confirmed = ? WHERE id = ?').run(newConfirmed, id);
    res.json ({ ...guest, confirmed: newConfirmed });
});

module.exports = router;
