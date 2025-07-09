const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine upload directory based on file type
    let uploadDir = 'uploads/documents';
    if (file.mimetype.startsWith('image/')) {
      uploadDir = 'uploads/images';
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedDocTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (allowedImageTypes.includes(file.mimetype) || allowedDocTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and documents are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// POST /api/uploads/image - Upload image
router.post('/image', authenticateToken, authorizeRole(['admin']), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }

    // Check if uploaded file is actually an image
    if (!req.file.mimetype.startsWith('image/')) {
      // Delete the uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Uploaded file is not an image.' });
    }

    const fileUrl = `/uploads/images/${path.basename(req.file.path)}`;
    
    res.status(201).json({
      message: 'Image uploaded successfully.',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Error uploading image.' });
  }
});

// POST /api/uploads/document - Upload document
router.post('/document', authenticateToken, authorizeRole(['admin']), upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No document file provided.' });
    }

    const fileUrl = `/uploads/documents/${path.basename(req.file.path)}`;
    
    res.status(201).json({
      message: 'Document uploaded successfully.',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ message: 'Error uploading document.' });
  }
});

// POST /api/uploads/multiple - Upload multiple files
router.post('/multiple', authenticateToken, authorizeRole(['admin']), upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files provided.' });
    }

    const uploadedFiles = req.files.map(file => {
      const fileUrl = file.mimetype.startsWith('image/') 
        ? `/uploads/images/${path.basename(file.path)}`
        : `/uploads/documents/${path.basename(file.path)}`;
      
      return {
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        url: fileUrl,
        size: file.size,
        mimetype: file.mimetype
      };
    });

    res.status(201).json({
      message: 'Files uploaded successfully.',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Multiple files upload error:', error);
    res.status(500).json({ message: 'Error uploading files.' });
  }
});

// DELETE /api/uploads/:filename - Delete uploaded file
router.delete('/:filename', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { filename } = req.params;
    const { type } = req.query; // 'image' or 'document'
    
    let filePath;
    if (type === 'image') {
      filePath = path.join('uploads/images', filename);
    } else if (type === 'document') {
      filePath = path.join('uploads/documents', filename);
    } else {
      // Try both directories
      const imagePath = path.join('uploads/images', filename);
      const docPath = path.join('uploads/documents', filename);
      
      if (fs.existsSync(imagePath)) {
        filePath = imagePath;
      } else if (fs.existsSync(docPath)) {
        filePath = docPath;
      } else {
        return res.status(404).json({ message: 'File not found.' });
      }
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully.' });
    } else {
      res.status(404).json({ message: 'File not found.' });
    }
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ message: 'Error deleting file.' });
  }
});

// GET /api/uploads/list - List uploaded files
router.get('/list', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { type } = req.query; // 'image', 'document', or 'all'
    
    let files = [];
    
    if (type === 'image' || type === 'all') {
      const imageDir = 'uploads/images';
      if (fs.existsSync(imageDir)) {
        const imageFiles = fs.readdirSync(imageDir)
          .filter(file => !file.startsWith('.'))
          .map(file => ({
            name: file,
            type: 'image',
            url: `/uploads/images/${file}`,
            path: path.join(imageDir, file)
          }));
        files = files.concat(imageFiles);
      }
    }
    
    if (type === 'document' || type === 'all') {
      const docDir = 'uploads/documents';
      if (fs.existsSync(docDir)) {
        const docFiles = fs.readdirSync(docDir)
          .filter(file => !file.startsWith('.'))
          .map(file => ({
            name: file,
            type: 'document',
            url: `/uploads/documents/${file}`,
            path: path.join(docDir, file)
          }));
        files = files.concat(docFiles);
      }
    }
    
    res.json({ files });
  } catch (error) {
    console.error('File listing error:', error);
    res.status(500).json({ message: 'Error listing files.' });
  }
});

module.exports = router; 