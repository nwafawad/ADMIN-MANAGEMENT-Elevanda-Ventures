const User = require('../models/User');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const Class = require('../models/Class');
const { toGradeDto, toAttendanceDto } = require('../dtos/academicDto');
const { toUserDto } = require('../dtos/userDto');

const getStudents = async ({ classId, search }) => {
  const query = { role: 'student' };
  if (classId) query.classId = classId;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  const students = await User.find(query).populate('classId', 'name').sort({ name: 1 });
  return students.map(toUserDto);
};

const upsertGrade = async (studentId, { subject, score, term, classId }, adminId) => {
  let grade = await Grade.findOne({ studentId, subject, term });
  if (grade) {
    grade.score = score;
    grade.classId = classId || grade.classId;
    grade.updatedBy = adminId;
    await grade.save();
  } else {
    grade = await Grade.create({ studentId, subject, score, term, classId, updatedBy: adminId });
  }
  const populated = await Grade.findById(grade._id).populate('updatedBy', 'name');
  return toGradeDto(populated);
};

const getGrades = async (studentId, { term }) => {
  const query = { studentId };
  if (term) query.term = term;
  const grades = await Grade.find(query).populate('updatedBy', 'name').sort({ createdAt: -1 });
  return grades.map(toGradeDto);
};

const upsertAttendance = async (studentId, { date, status, classId }, adminId) => {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  let attendance = await Attendance.findOne({ studentId, date: dateObj, classId });
  if (attendance) {
    attendance.status = status;
    attendance.updatedBy = adminId;
    await attendance.save();
  } else {
    attendance = await Attendance.create({ studentId, date: dateObj, status, classId, updatedBy: adminId });
  }
  const populated = await Attendance.findById(attendance._id).populate('classId', 'name').populate('updatedBy', 'name');
  return toAttendanceDto(populated);
};

const bulkAttendance = async ({ classId, date, records }, adminId) => {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  const results = [];
  for (const record of records) {
    let att = await Attendance.findOne({ studentId: record.studentId, date: dateObj, classId });
    if (att) {
      att.status = record.status;
      att.updatedBy = adminId;
      await att.save();
    } else {
      att = await Attendance.create({ studentId: record.studentId, date: dateObj, status: record.status, classId, updatedBy: adminId });
    }
    results.push(att);
  }
  const populated = await Attendance.find({ _id: { $in: results.map(r => r._id) } })
    .populate('classId', 'name').populate('updatedBy', 'name');
  return { updated: results.length, records: populated.map(toAttendanceDto) };
};

const getAttendance = async (studentId, { startDate, endDate }) => {
  const query = { studentId };
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  const records = await Attendance.find(query).populate('classId', 'name').populate('updatedBy', 'name').sort({ date: -1 });
  const total = records.length;
  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const late = records.filter(r => r.status === 'late').length;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
  return {
    records: records.map(toAttendanceDto),
    summary: { total, present, absent, late, attendanceRate },
  };
};

module.exports = { getStudents, upsertGrade, getGrades, upsertAttendance, bulkAttendance, getAttendance };
