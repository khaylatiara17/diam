const express = require('express');
const router = express.Router();
const kontakController = require('../controllers/kontakController');

router.get('/', kontakController.getKontakInfo);
router.post('/', kontakController.updateKontakInfo);

module.exports = router;
