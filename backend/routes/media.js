const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('./auth');

// Configure multer for media uploads
const storage = multer.diskStorage({
    destination: './uploads/media/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|gif|pdf|doc|docx|xls|xlsx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Ongeldig bestandstype!'));
    }
});

// Get all media files
router.get('/', verifyToken, async (req, res) => {
    try {
        const mediaDir = './uploads/media/';
        if (!fs.existsSync(mediaDir)) {
            fs.mkdirSync(mediaDir, { recursive: true });
        }

        const files = fs.readdirSync(mediaDir);
        const mediaFiles = files.map(file => ({
            name: file,
            url: `/uploads/media/${file}`,
            type: path.extname(file).toLowerCase(),
            size: fs.statSync(path.join(mediaDir, file)).size,
            lastModified: fs.statSync(path.join(mediaDir, file)).mtime
        }));

        res.json(mediaFiles);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload media file
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Geen bestand geüpload' });
        }

        res.json({
            message: 'Bestand succesvol geüpload',
            file: {
                name: req.file.filename,
                url: `/uploads/media/${req.file.filename}`,
                type: path.extname(req.file.filename).toLowerCase(),
                size: req.file.size
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Upload error' });
    }
});

// Delete media file
router.delete('/:filename', verifyToken, async (req, res) => {
    try {
        const filePath = path.join('./uploads/media/', req.params.filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Bestand niet gevonden' });
        }

        fs.unlinkSync(filePath);
        res.json({ message: 'Bestand succesvol verwijderd' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 