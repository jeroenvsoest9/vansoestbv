const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { verifyToken } = require('./auth');
const multer = require('multer');
const path = require('path');
const { OpenAI } = require('openai');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Alleen afbeeldingen zijn toegestaan!'));
  },
});

// Initialize OpenAI
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Get all content
router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query;
    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;

    const content = await Content.find(query).populate('author', 'username').sort('-createdAt');

    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single content item
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('author', 'username');

    if (!content) {
      return res.status(404).json({ message: 'Content niet gevonden' });
    }

    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create content
router.post('/', verifyToken, upload.array('images', 5), async (req, res) => {
  try {
    const { title, content, type, status } = req.body;

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Process uploaded images
    const images = req.files
      ? req.files.map((file) => ({
          url: `/uploads/${file.filename}`,
          alt: title,
        }))
      : [];

    const newContent = new Content({
      title,
      content,
      type,
      slug,
      status: status || 'draft',
      images,
      author: req.user.id,
    });

    await newContent.save();
    res.status(201).json(newContent);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update content
router.put('/:id', verifyToken, upload.array('images', 5), async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ message: 'Content niet gevonden' });
    }

    // Process new images if any
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        alt: req.body.title || content.title,
      }));
      content.images = [...content.images, ...newImages];
    }

    // Update fields
    Object.keys(req.body).forEach((key) => {
      if (key !== 'images') {
        content[key] = req.body[key];
      }
    });

    await content.save();
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete content
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ message: 'Content niet gevonden' });
    }

    await content.remove();
    res.json({ message: 'Content succesvol verwijderd' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate content with AI
router.post('/generate', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Geen afbeelding geüpload' });
    }

    // Analyze image with OpenAI Vision
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Genereer een professionele Nederlandse beschrijving voor deze afbeelding, geschikt voor een bouwbedrijf website.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
              },
            },
          ],
        },
      ],
    });

    res.json({
      generatedContent: response.choices[0].message.content,
      imageUrl: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    res.status(500).json({ message: 'AI generatie error' });
  }
});

module.exports = router;
