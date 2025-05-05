const express = require('express');
const {
  listProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertiesController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.get('/', listProperties);
router.get('/:id', getProperty);

// Protected routes (authentication required)
router.post('/', authMiddleware, createProperty);
router.put('/:id', authMiddleware, updateProperty);
router.delete('/:id', authMiddleware, deleteProperty);

module.exports = router;