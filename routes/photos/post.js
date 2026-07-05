const express = require('express');
const router = express.Router();
const { db } = require('../../database');

const cloudinary = require('cloudinary').v2;
cloudinary.config ({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})
console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
})

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/photos', upload.single('photo'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const caption = req.body.caption || null
    
    try {
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'aniversario-caleb' },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )
            stream.end(req.file.buffer)
        })

        const result = await db.execute({
            sql: 'INSERT INTO photos (url, public_id, caption) VALUES (?, ?, ?)',
            args: [uploadResult.secure_url, uploadResult.public_id, caption]
        })

        res.status(201).json({
            id: Number(result.lastInsertRowid),
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
            caption
        })
    } catch (err) {
        console.error('Upload error:', err.message || JSON.stringify(err))
        res.status(500).json({ error: err.message })
    }
})

module.exports = router;