const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/register', upload.single('image'), authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;

