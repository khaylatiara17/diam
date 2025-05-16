const express = require('express');
const router = express.Router();
const profilController = require('../controllers/profilController');

router.get('/', profilController.getProfil);
router.post('/', profilController.updateProfil);

module.exports = router;
