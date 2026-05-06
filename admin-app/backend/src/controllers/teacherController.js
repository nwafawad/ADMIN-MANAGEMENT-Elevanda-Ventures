const asyncHandler = require('../middlewares/asyncHandler');
const teacherService = require('../services/teacherService');

exports.createTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.createTeacher(req.body);
  res.status(201).json({ success: true, data: teacher });
});

exports.getTeachers = asyncHandler(async (req, res) => {
  const result = await teacherService.getTeachers(req.query);
  res.json({ success: true, data: result });
});

exports.getTeacherById = asyncHandler(async (req, res) => {
  const teacher = await teacherService.getTeacherById(req.params.id);
  res.json({ success: true, data: teacher });
});

exports.updateTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.updateTeacher(req.params.id, req.body);
  res.json({ success: true, data: teacher });
});

exports.deleteTeacher = asyncHandler(async (req, res) => {
  const result = await teacherService.deleteTeacher(req.params.id);
  res.json(result);
});
