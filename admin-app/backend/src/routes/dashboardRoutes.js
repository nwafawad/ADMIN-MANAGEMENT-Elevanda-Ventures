const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminOnly');

const router = express.Router();

router.use(authMiddleware, adminOnly);
router.get('/stats', dashboardController.getStats);

module.exports = router;
