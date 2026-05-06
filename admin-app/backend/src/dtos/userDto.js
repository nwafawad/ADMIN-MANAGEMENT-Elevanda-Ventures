/**
 * Transforms a User document into a safe DTO.
 * Omits passwordHash, deviceId, and __v.
 */
const toUserDto = (user) => {
  if (!user) return null;

  const dto = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isDeviceVerified: user.isDeviceVerified,
    classId: user.classId || null,
    childId: user.childId || null,
    createdAt: user.createdAt,
  };

  // If classId is populated (object), include class info
  if (user.classId && typeof user.classId === 'object' && user.classId.name) {
    dto.classId = {
      id: user.classId._id,
      name: user.classId.name,
    };
  }

  // If childId is populated (object), include child info
  if (user.childId && typeof user.childId === 'object' && user.childId.name) {
    dto.childId = {
      id: user.childId._id,
      name: user.childId.name,
      email: user.childId.email,
    };
  }

  return dto;
};

module.exports = { toUserDto };
