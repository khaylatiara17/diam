const express = require('express');
const router = express.Router();
const applyController = require('../controllers/applyController');

// POST /api/apply - Submit new application
router.post('/', applyController.submitApplication);

module.exports = router;
