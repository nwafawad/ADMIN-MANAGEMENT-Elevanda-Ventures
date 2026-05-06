const Class = require('../models/Class');
const User = require('../models/User');
const Timetable = require('../models/Timetable');
const { toClassDto } = require('../dtos/classDto');
const { toTimetableDto } = require('../dtos/academicDto');

const createClass = async ({ name, teacherId }) => {
  const existing = await Class.findOne({ name });
  if (existing) throw Object.assign(new Error('Class name already exists'), { statusCode: 409 });
  const classDoc = await Class.create({ name, teacherId: teacherId || null, studentIds: [] });
  if (teacherId) await User.findByIdAndUpdate(teacherId, { classId: classDoc._id });
  const populated = await Class.findById(classDoc._id).populate('teacherId', 'name email');
  return toClassDto(populated);
};

const getClasses = async ({ page = 1, limit = 15, search }) => {
  const query = {};
  if (search) query.name = { $regex: search, $options: 'i' };
  const skip = (page - 1) * limit;
  const [classes, total] = await Promise.all([
    Class.find(query).populate('teacherId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Class.countDocuments(query),
  ]);
  return { classes: classes.map(toClassDto), total, page: parseInt(page), totalPages: Math.ceil(total / limit) };
};

const getClassById = async (id) => {
  const classDoc = await Class.findById(id).populate('teacherId', 'name email').populate('studentIds', 'name email isDeviceVerified');
  if (!classDoc) throw Object.assign(new Error('Class not found'), { statusCode: 404 });
  const timetable = await Timetable.find({ classId: id }).sort({ dayOfWeek: 1, startTime: 1 });
  const dto = toClassDto(classDoc);
  dto.timetable = timetable.map(toTimetableDto);
  return dto;
};

const assignTeacher = async (classId, teacherId) => {
  const classDoc = await Class.findById(classId);
  if (!classDoc) throw Object.assign(new Error('Class not found'), { statusCode: 404 });
  const teacher = await User.findOne({ _id: teacherId, role: 'teacher' });
  if (!teacher) throw Object.assign(new Error('Teacher not found'), { statusCode: 404 });
  if (classDoc.teacherId) await User.findByIdAndUpdate(classDoc.teacherId, { $unset: { classId: '' } });
  classDoc.teacherId = teacherId;
  await classDoc.save();
  teacher.classId = classDoc._id;
  await teacher.save();
  const populated = await Class.findById(classId).populate('teacherId', 'name email').populate('studentIds', 'name email isDeviceVerified');
  return toClassDto(populated);
};

const addStudent = async (classId, studentId) => {
  const classDoc = await Class.findById(classId);
  if (!classDoc) throw Object.assign(new Error('Class not found'), { statusCode: 404 });
  const student = await User.findOne({ _id: studentId, role: 'student' });
  if (!student) throw Object.assign(new Error('Student not found'), { statusCode: 404 });
  classDoc.studentIds.addToSet(studentId);
  await classDoc.save();
  student.classId = classDoc._id;
  await student.save();
  const populated = await Class.findById(classId).populate('teacherId', 'name email').populate('studentIds', 'name email isDeviceVerified');
  return toClassDto(populated);
};

const removeStudent = async (classId, studentId) => {
  const classDoc = await Class.findById(classId);
  if (!classDoc) throw Object.assign(new Error('Class not found'), { statusCode: 404 });
  classDoc.studentIds.pull(studentId);
  await classDoc.save();
  await User.findByIdAndUpdate(studentId, { $unset: { classId: '' } });
  const populated = await Class.findById(classId).populate('teacherId', 'name email').populate('studentIds', 'name email isDeviceVerified');
  return toClassDto(populated);
};

const addTimetableSlot = async (classId, slotData) => {
  const classDoc = await Class.findById(classId);
  if (!classDoc) throw Object.assign(new Error('Class not found'), { statusCode: 404 });
  const existing = await Timetable.find({ classId, dayOfWeek: slotData.dayOfWeek });
  for (const slot of existing) {
    if ((slotData.startTime >= slot.startTime && slotData.startTime < slot.endTime) ||
        (slotData.endTime > slot.startTime && slotData.endTime <= slot.endTime) ||
        (slotData.startTime <= slot.startTime && slotData.endTime >= slot.endTime)) {
      throw Object.assign(new Error(`Time conflict with ${slot.subject} (${slot.startTime}-${slot.endTime})`), { statusCode: 400 });
    }
  }
  const entry = await Timetable.create({ classId, ...slotData });
  return toTimetableDto(entry);
};

const deleteTimetableSlot = async (classId, slotId) => {
  const result = await Timetable.findOneAndDelete({ _id: slotId, classId });
  if (!result) throw Object.assign(new Error('Timetable slot not found'), { statusCode: 404 });
  return { success: true };
};

const deleteClass = async (id) => {
  const classDoc = await Class.findById(id);
  if (!classDoc) throw Object.assign(new Error('Class not found'), { statusCode: 404 });
  await Timetable.deleteMany({ classId: id });
  await User.updateMany({ _id: { $in: [...classDoc.studentIds, classDoc.teacherId].filter(Boolean) } }, { $unset: { classId: '' } });
  await Class.findByIdAndDelete(id);
  return { success: true };
};

module.exports = { createClass, getClasses, getClassById, assignTeacher, addStudent, removeStudent, addTimetableSlot, deleteTimetableSlot, deleteClass };
