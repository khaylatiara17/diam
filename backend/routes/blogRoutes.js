const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/', blogController.getAllPosts);
router.get('/:id', blogController.getPostById);
router.post('/', blogController.createPost);
router.put('/:id', blogController.updatePost);
router.delete('/:id', blogController.deletePost);

module.exports = router;
