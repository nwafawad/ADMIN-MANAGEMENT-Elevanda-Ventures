const express = require('express');
const feeController = require('../controllers/feeController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminOnly');

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.get('/', feeController.getTransactions);
router.get('/pending', feeController.getPending);
router.get('/stats', feeController.getStats);
router.patch('/:id/approve', feeController.approve);
router.patch('/:id/reject', feeController.reject);

module.exports = router;
