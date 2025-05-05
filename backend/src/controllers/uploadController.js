// backend/src/controllers/uploadController.js
const fs = require('fs').promises;
const path = require('path');
const { v4: uuid } = require('uuid');

// Define base upload directory and allowed file types
const UPLOAD_DIR = path.join(__dirname, '../../data/upload');
const IMAGES_DIR = path.join(UPLOAD_DIR, 'images');
const VIDEOS_DIR = path.join(UPLOAD_DIR, 'videos');
const FILES_DIR = path.join(UPLOAD_DIR, 'files');

// Ensure the upload directories exist
async function ensureDirectoriesExist() {
  try {
    await fs.mkdir(IMAGES_DIR, { recursive: true });
    await fs.mkdir(VIDEOS_DIR, { recursive: true });
    await fs.mkdir(FILES_DIR, { recursive: true });
    console.log('Upload directories verified');
  } catch (err) {
    console.error('Error creating upload directories:', err);
    throw err;
  }
}

// Initialize directories when the server starts
ensureDirectoriesExist();

// Function to get file extension
function getFileExtension(filename) {
  return path.extname(filename).toLowerCase();
}

// Function to check if file is an allowed image
function isAllowedImage(filename) {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return allowedExtensions.includes(getFileExtension(filename));
}

// Function to check if file is an allowed video
function isAllowedVideo(filename) {
  const allowedExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return allowedExtensions.includes(getFileExtension(filename));
}

// Function to check if file is allowed for general upload
function isAllowedFile(filename) {
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.glb', '.gltf', '.obj'];
  return allowedExtensions.includes(getFileExtension(filename));
}

// Handle file upload
async function uploadFile(req, res) {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get file info
    const { originalname, buffer, mimetype } = req.file;
    const fileType = req.body.type || 'file'; // 'image', 'video', or 'file'
    
    // Generate unique filename
    const fileExtension = getFileExtension(originalname);
    const newFilename = `${uuid()}${fileExtension}`;
    
    // Determine upload directory and validate file type
    let uploadDir;
    let fileUrl;
    
    if (fileType === 'image') {
      if (!isAllowedImage(originalname)) {
        return res.status(400).json({ message: 'Invalid image file type' });
      }
      uploadDir = IMAGES_DIR;
      fileUrl = `/images/${newFilename}`;
    } else if (fileType === 'video') {
      if (!isAllowedVideo(originalname)) {
        return res.status(400).json({ message: 'Invalid video file type' });
      }
      uploadDir = VIDEOS_DIR;
      fileUrl = `/videos/${newFilename}`;
    } else {
      if (!isAllowedFile(originalname)) {
        return res.status(400).json({ message: 'Invalid file type' });
      }
      uploadDir = FILES_DIR;
      fileUrl = `/files/${newFilename}`;
    }
    
    // Save the file
    const filePath = path.join(uploadDir, newFilename);
    await fs.writeFile(filePath, buffer);
    
    // Return success response with file URL
    return res.status(201).json({
      message: 'File uploaded successfully',
      fileUrl,
      originalName: originalname,
      mimeType: mimetype
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ message: 'File upload failed', error: error.message });
  }
}

module.exports = { uploadFile };