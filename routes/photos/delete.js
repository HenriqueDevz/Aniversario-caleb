const express = require('express');
const router = express.Router();
const { db } = require('../../database');

const cloudinary = require('cloudinary').v2;
cloudinary.config ({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

router.delete('/photos/:id', async (req, res) => {
    const { id } = req.params;
    const photoResult = await db.execute({
        sql: 'SELECT * FROM photos WHERE id = ?',
        args: [id]
    })
    const photo = photoResult.rows[0]
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    await cloudinary.uploader.destroy(photo.public_id)

    await db.execute({
        sql: 'DELETE FROM photos WHERE id = ?',
        args: [id]
    })
    res.json({ message: 'photo deleted succesfully' });
});

module.exports = router;