const express = require('express');
const { body } = require('express-validator');
const academicController = require('../controllers/academicController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminOnly');

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.get('/students', academicController.getStudents);

router.patch(
  '/grades/:studentId',
  [
    body('subject').notEmpty().withMessage('Subject is required'),
    body('score').isNumeric().custom(v => v >= 0 && v <= 100).withMessage('Score must be between 0 and 100'),
    body('term').notEmpty().withMessage('Term is required'),
  ],
  academicController.upsertGrade
);

router.get('/grades/:studentId', academicController.getGrades);

router.patch(
  '/attendance/:studentId',
  [
    body('date').isISO8601().withMessage('Valid date is required'),
    body('status').isIn(['present', 'absent', 'late']).withMessage('Invalid status'),
  ],
  academicController.upsertAttendance
);

router.post(
  '/attendance/bulk',
  [
    body('classId').notEmpty().withMessage('Class ID is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('records').isArray().withMessage('Records array is required'),
  ],
  academicController.bulkAttendance
);

router.get('/attendance/:studentId', academicController.getAttendance);

module.exports = router;
