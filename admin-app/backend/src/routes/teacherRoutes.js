const express = require('express');
const { body } = require('express-validator');
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminOnly');

const router = express.Router();

router.use(authMiddleware, adminOnly);

const createValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'), // Frontend sends SHA-512 hash
];

router.post('/', createValidation, teacherController.createTeacher);
router.get('/', teacherController.getTeachers);
router.get('/:id', teacherController.getTeacherById);
router.patch('/:id', teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
