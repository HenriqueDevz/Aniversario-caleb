const express = require('express');
const router = express.Router();
const db = require('../../database');

router.delete('/guests/:id', (req, res) => {
    const { id } = req.params
    const guest = db.prepare('SELECT * FROM guests WHERE id = ?').get(id);

    if (!guest) {
        return res.status(404).json({ error: 'Guest not found'});
    }

    db.prepare('DELETE FROM guests WHERE id = ?').run(id)
    res.json({ message: 'Guest deleted sucessfully'});
});

module.exports = router