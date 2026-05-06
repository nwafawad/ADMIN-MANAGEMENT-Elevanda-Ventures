const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be less than 0'],
      max: [100, 'Score cannot exceed 100'],
    },
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'F'],
    },
    term: {
      type: String,
      required: [true, 'Term is required'],
      trim: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compute grade from score before saving — matches client app grading scale
gradeSchema.pre('save', function (next) {
  if (this.score >= 90) this.grade = 'A';
  else if (this.score >= 80) this.grade = 'B';
  else if (this.score >= 70) this.grade = 'C';
  else if (this.score >= 60) this.grade = 'D';
  else this.grade = 'F';
  next();
});

gradeSchema.index({ studentId: 1, term: 1 });

module.exports = mongoose.model('Grade', gradeSchema);
