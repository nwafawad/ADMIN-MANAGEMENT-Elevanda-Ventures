const express = require('express');
const { body } = require('express-validator');
const classController = require('../controllers/classController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminOnly');

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Class name is required')],
  classController.createClass
);

router.get('/', classController.getClasses);
router.get('/:id', classController.getClassById);

router.patch(
  '/:id/assign-teacher',
  [body('teacherId').notEmpty().withMessage('Teacher ID is required')],
  classController.assignTeacher
);

router.patch(
  '/:id/add-student',
  [body('studentId').notEmpty().withMessage('Student ID is required')],
  classController.addStudent
);

router.patch(
  '/:id/remove-student',
  [body('studentId').notEmpty().withMessage('Student ID is required')],
  classController.removeStudent
);

router.post(
  '/:id/timetable',
  [
    body('subject').notEmpty().withMessage('Subject is required'),
    body('dayOfWeek').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']).withMessage('Invalid day'),
    body('startTime').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be HH:mm'),
    body('endTime').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be HH:mm'),
  ],
  classController.addTimetableSlot
);

router.delete('/:id/timetable/:slotId', classController.deleteTimetableSlot);
router.delete('/:id', classController.deleteClass);

module.exports = router;
