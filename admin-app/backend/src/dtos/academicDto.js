/**
 * Transforms a Grade document into a DTO.
 */
const toGradeDto = (grade) => {
  if (!grade) return null;

  const dto = {
    id: grade._id,
    studentId: grade.studentId,
    subject: grade.subject,
    score: grade.score,
    grade: grade.grade,
    term: grade.term,
    classId: grade.classId || null,
    updatedBy: grade.updatedBy || null,
    createdAt: grade.createdAt,
  };

  // If updatedBy is populated
  if (grade.updatedBy && typeof grade.updatedBy === 'object' && grade.updatedBy.name) {
    dto.updatedBy = {
      id: grade.updatedBy._id,
      name: grade.updatedBy.name,
    };
  }

  return dto;
};

/**
 * Transforms an Attendance document into a DTO.
 */
const toAttendanceDto = (attendance) => {
  if (!attendance) return null;

  const dto = {
    id: attendance._id,
    studentId: attendance.studentId,
    date: attendance.date,
    status: attendance.status,
    classId: attendance.classId || null,
    updatedBy: attendance.updatedBy || null,
    createdAt: attendance.createdAt,
  };

  // If classId is populated
  if (attendance.classId && typeof attendance.classId === 'object' && attendance.classId.name) {
    dto.classId = {
      id: attendance.classId._id,
      name: attendance.classId.name,
    };
  }

  // If updatedBy is populated
  if (attendance.updatedBy && typeof attendance.updatedBy === 'object' && attendance.updatedBy.name) {
    dto.updatedBy = {
      id: attendance.updatedBy._id,
      name: attendance.updatedBy.name,
    };
  }

  return dto;
};

/**
 * Transforms a Timetable document into a DTO.
 */
const toTimetableDto = (entry) => {
  if (!entry) return null;
  return {
    id: entry._id,
    classId: entry.classId,
    subject: entry.subject,
    teacherName: entry.teacherName,
    teacherId: entry.teacherId,
    dayOfWeek: entry.dayOfWeek,
    startTime: entry.startTime,
    endTime: entry.endTime,
  };
};

module.exports = { toGradeDto, toAttendanceDto, toTimetableDto };
