export const computeGrade = (score) => {
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
};

export const gradeColorMap = {
  A: 'emerald',
  B: 'blue',
  C: 'amber',
  D: 'orange',
  F: 'red',
};
