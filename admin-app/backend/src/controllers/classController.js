const asyncHandler = require('../middlewares/asyncHandler');
const classService = require('../services/classService');

exports.createClass = asyncHandler(async (req, res) => {
  const cls = await classService.createClass(req.body);
  res.status(201).json({ success: true, data: cls });
});

exports.getClasses = asyncHandler(async (req, res) => {
  const result = await classService.getClasses(req.query);
  res.json({ success: true, data: result });
});

exports.getClassById = asyncHandler(async (req, res) => {
  const cls = await classService.getClassById(req.params.id);
  res.json({ success: true, data: cls });
});

exports.assignTeacher = asyncHandler(async (req, res) => {
  const cls = await classService.assignTeacher(req.params.id, req.body.teacherId);
  res.json({ success: true, data: cls });
});

exports.addStudent = asyncHandler(async (req, res) => {
  const cls = await classService.addStudent(req.params.id, req.body.studentId);
  res.json({ success: true, data: cls });
});

exports.removeStudent = asyncHandler(async (req, res) => {
  const cls = await classService.removeStudent(req.params.id, req.body.studentId);
  res.json({ success: true, data: cls });
});

exports.addTimetableSlot = asyncHandler(async (req, res) => {
  const slot = await classService.addTimetableSlot(req.params.id, req.body);
  res.status(201).json({ success: true, data: slot });
});

exports.deleteTimetableSlot = asyncHandler(async (req, res) => {
  const result = await classService.deleteTimetableSlot(req.params.id, req.params.slotId);
  res.json(result);
});

exports.deleteClass = asyncHandler(async (req, res) => {
  const result = await classService.deleteClass(req.params.id);
  res.json(result);
});
