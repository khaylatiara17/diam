const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST /api/contact
router.post('/', contactController.sendContact);

module.exports = router;
