const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminOnly');

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.get('/', userController.getUsers);
router.get('/pending-verification', userController.getPendingVerification);
router.get('/:id', userController.getUserById);

router.patch(
  '/:id/verify-device',
  [body('verified').isBoolean().withMessage('Verified must be a boolean')],
  userController.verifyDevice
);

router.patch(
  '/:id/assign-class',
  [body('classId').notEmpty().withMessage('Class ID is required')],
  userController.assignClass
);

router.patch(
  '/:id/link-child',
  [body('childEmail').isEmail().withMessage('Valid child email is required')],
  userController.linkChild
);

router.patch(
  '/:id/role',
  [body('role').isIn(['student', 'parent', 'teacher', 'admin']).withMessage('Invalid role')],
  userController.updateRole
);

router.delete('/:id', userController.deleteUser);

module.exports = router;
