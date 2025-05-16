const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.post('/add', serviceController.addService);
router.get('/', serviceController.getServices);
router.post('/filter', serviceController.filterServices);
router.get('/export', serviceController.exportServices);

module.exports = router;
