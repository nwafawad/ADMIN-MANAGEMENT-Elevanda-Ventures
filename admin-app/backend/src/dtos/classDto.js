/**
 * Transforms a Class document into a DTO.
 */
const toClassDto = (classDoc) => {
  if (!classDoc) return null;

  const dto = {
    id: classDoc._id,
    name: classDoc.name,
    teacher: null,
    studentCount: classDoc.studentIds ? classDoc.studentIds.length : 0,
    studentIds: [],
    createdAt: classDoc.createdAt,
  };

  // If teacherId is populated
  if (classDoc.teacherId && typeof classDoc.teacherId === 'object' && classDoc.teacherId.name) {
    dto.teacher = {
      id: classDoc.teacherId._id,
      name: classDoc.teacherId.name,
      email: classDoc.teacherId.email,
    };
  } else if (classDoc.teacherId) {
    dto.teacher = classDoc.teacherId;
  }

  // If studentIds are populated
  if (classDoc.studentIds && classDoc.studentIds.length > 0) {
    if (typeof classDoc.studentIds[0] === 'object' && classDoc.studentIds[0].name) {
      dto.studentIds = classDoc.studentIds.map((s) => ({
        id: s._id,
        name: s.name,
        email: s.email,
        isDeviceVerified: s.isDeviceVerified,
      }));
    }
    dto.studentCount = classDoc.studentIds.length;
  }

  return dto;
};

module.exports = { toClassDto };
