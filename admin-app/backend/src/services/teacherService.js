const User = require('../models/User');
const Class = require('../models/Class');
const { toTeacherDto } = require('../dtos/teacherDto');
const { hashPassword } = require('./authService');

/**
 * Create a new teacher account.
 * Password received is already SHA-512 pre-hashed by the frontend.
 */
const createTeacher = async ({ name, email, password, classId }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw Object.assign(new Error('Email is already registered'), { statusCode: 409 });
  }

  const passwordHash = hashPassword(password);

  const teacher = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: 'teacher',
    deviceId: `teacher-${Date.now()}`,
    isDeviceVerified: true,
    classId: classId || null,
  });

  // If classId provided, assign teacher to class
  if (classId) {
    await Class.findByIdAndUpdate(classId, { teacherId: teacher._id });
  }

  const populated = await User.findById(teacher._id).populate('classId', 'name');
  return toTeacherDto(populated);
};

/**
 * Get paginated teachers.
 */
const getTeachers = async ({ page = 1, limit = 15, search }) => {
  const query = { role: 'teacher' };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [teachers, total] = await Promise.all([
    User.find(query)
      .populate('classId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(query),
  ]);

  return {
    teachers: teachers.map(toTeacherDto),
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get a teacher by ID with timetable info.
 */
const getTeacherById = async (id) => {
  const teacher = await User.findOne({ _id: id, role: 'teacher' }).populate('classId', 'name');
  if (!teacher) {
    throw Object.assign(new Error('Teacher not found'), { statusCode: 404 });
  }
  return toTeacherDto(teacher);
};

/**
 * Update a teacher.
 */
const updateTeacher = async (id, { name, classId }) => {
  const teacher = await User.findOne({ _id: id, role: 'teacher' });
  if (!teacher) {
    throw Object.assign(new Error('Teacher not found'), { statusCode: 404 });
  }

  if (name) teacher.name = name;

  // Handle class reassignment
  if (classId !== undefined) {
    // Unset old class teacherId
    if (teacher.classId) {
      await Class.findByIdAndUpdate(teacher.classId, { $unset: { teacherId: '' } });
    }

    if (classId) {
      teacher.classId = classId;
      await Class.findByIdAndUpdate(classId, { teacherId: teacher._id });
    } else {
      teacher.classId = null;
    }
  }

  await teacher.save();

  const populated = await User.findById(id).populate('classId', 'name');
  return toTeacherDto(populated);
};

/**
 * Delete a teacher.
 */
const deleteTeacher = async (id) => {
  const teacher = await User.findOne({ _id: id, role: 'teacher' });
  if (!teacher) {
    throw Object.assign(new Error('Teacher not found'), { statusCode: 404 });
  }

  // Unset teacherId on any class
  await Class.updateMany({ teacherId: teacher._id }, { $unset: { teacherId: '' } });

  await User.findByIdAndDelete(id);
  return { success: true };
};

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
