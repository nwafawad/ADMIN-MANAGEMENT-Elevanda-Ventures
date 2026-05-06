export const computeGrade = (score) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

export const gradeColorMap = {
  A: 'emerald',
  B: 'blue',
  C: 'amber',
  D: 'orange',
  F: 'red',
};
