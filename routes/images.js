const express = require('express');
const sharp = require('sharp');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { generateId } = require('../utils/idGenerator');

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
const THUMBNAIL_WIDTH = 200; // pixels
const THUMBNAIL_HEIGHT = 200; // pixels

// Ensure uploads directory exists
fs.mkdir(UPLOADS_DIR, { recursive: true }).catch(console.error);

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const imageId = generateId('img_');
        const ext = path.extname(file.originalname);
        cb(null, `${imageId}${ext}`);
    }
});
const upload = multer({ storage: storage });

// POST /api/images/upload-from-url
// Downloads an image from a URL, resizes it to a thumbnail, and saves it.
router.post('/upload-from-url', protect, isAdmin, async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required.' });
    }

    try {
        // 1. Download the image
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);

        // 2. Process and save as thumbnail
        const imageId = generateId('img_');
        const filename = `${imageId}.webp`; // Using webp for modern compression
        const filePath = path.join(UPLOADS_DIR, filename);

        // Save full-size image
        const fullSizeFilename = `${imageId}_full.webp`;
        const fullSizeFilePath = path.join(UPLOADS_DIR, fullSizeFilename);
        await sharp(imageBuffer)
            .webp({ quality: 90 })
            .toFile(fullSizeFilePath);

        // Save thumbnail
        const thumbnailFilename = `${imageId}.webp`;
        const thumbnailFilePath = path.join(UPLOADS_DIR, thumbnailFilename);
        await sharp(imageBuffer)
            .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, { fit: 'cover' })
            .webp({ quality: 80 })
            .toFile(thumbnailFilePath);

        // Return the URLs to the saved images
        const imageUrlPath = `/uploads/${thumbnailFilename}`;
        const fullSizeImageUrlPath = `/uploads/${fullSizeFilename}`;
        res.status(200).json({ imageUrl: imageUrlPath, fullSizeImageUrl: fullSizeImageUrlPath });

    } catch (error) {
        console.error('Error processing image from URL:', error);
        res.status(500).json({ message: 'Failed to process image from URL.', error: error.message });
    }
});

// POST /api/images/upload
// Uploads an image file, resizes it to a thumbnail, and saves it.
router.post('/upload', protect, isAdmin, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        const imageBuffer = await fs.readFile(req.file.path);
        const imageId = path.parse(req.file.filename).name; // Get filename without extension

        // Save full-size image (rename the uploaded file to _full.webp)
        const fullSizeFilename = `${imageId}_full.webp`;
        const fullSizeFilePath = path.join(UPLOADS_DIR, fullSizeFilename);
        await sharp(imageBuffer)
            .webp({ quality: 90 })
            .toFile(fullSizeFilePath);
        
        // Save thumbnail
        const thumbnailFilename = `${imageId}.webp`;
        const thumbnailFilePath = path.join(UPLOADS_DIR, thumbnailFilename);
        await sharp(imageBuffer)
            .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, { fit: 'cover' })
            .webp({ quality: 80 })
            .toFile(thumbnailFilePath);

        // Clean up the original uploaded file
        await fs.unlink(req.file.path);

        // Return the URLs to the saved images
        const imageUrlPath = `/uploads/${thumbnailFilename}`;
        const fullSizeImageUrlPath = `/uploads/${fullSizeFilename}`;
        res.status(200).json({ imageUrl: imageUrlPath, fullSizeImageUrl: fullSizeImageUrlPath });

    } catch (error) {
        console.error('Error processing uploaded image:', error);
        res.status(500).json({ message: 'Failed to process uploaded image.', error: error.message });
    }
});

module.exports = router;