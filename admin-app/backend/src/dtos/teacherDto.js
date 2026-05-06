/**
 * Transforms a teacher User document into a DTO.
 */
const toTeacherDto = (teacher) => {
  if (!teacher) return null;

  const dto = {
    id: teacher._id,
    name: teacher.name,
    email: teacher.email,
    isDeviceVerified: teacher.isDeviceVerified,
    createdAt: teacher.createdAt,
    classId: teacher.classId || null,
  };

  // If classId is populated
  if (teacher.classId && typeof teacher.classId === 'object' && teacher.classId.name) {
    dto.classId = {
      id: teacher.classId._id,
      name: teacher.classId.name,
    };
  }

  return dto;
};

module.exports = { toTeacherDto };
