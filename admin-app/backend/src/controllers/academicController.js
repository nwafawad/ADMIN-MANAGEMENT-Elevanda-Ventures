const asyncHandler = require('../middlewares/asyncHandler');
const academicService = require('../services/academicService');

exports.getStudents = asyncHandler(async (req, res) => {
  const students = await academicService.getStudents(req.query);
  res.json({ success: true, data: students });
});

exports.upsertGrade = asyncHandler(async (req, res) => {
  const grade = await academicService.upsertGrade(req.params.studentId, req.body, req.admin._id);
  res.json({ success: true, data: grade });
});

exports.getGrades = asyncHandler(async (req, res) => {
  const grades = await academicService.getGrades(req.params.studentId, req.query);
  res.json({ success: true, data: grades });
});

exports.upsertAttendance = asyncHandler(async (req, res) => {
  const attendance = await academicService.upsertAttendance(req.params.studentId, req.body, req.admin._id);
  res.json({ success: true, data: attendance });
});

exports.bulkAttendance = asyncHandler(async (req, res) => {
  const result = await academicService.bulkAttendance(req.body, req.admin._id);
  res.json({ success: true, data: result });
});

exports.getAttendance = asyncHandler(async (req, res) => {
  const result = await academicService.getAttendance(req.params.studentId, req.query);
  res.json({ success: true, data: result });
});
