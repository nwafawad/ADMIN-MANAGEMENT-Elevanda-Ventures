import Badge from '../ui/Badge';

const gradeColors = {
  A: 'green',
  B: 'blue',
  C: 'yellow',
  D: 'orange',
  F: 'red',
};

export default function GradeTable({ grades }) {
  if (!grades || grades.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="mt-3 text-sm text-gray-500">No grades found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Term</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {grades.map((grade) => (
            <tr key={grade.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{grade.subject}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{grade.score}/100</td>
              <td className="px-4 py-3">
                <Badge color={gradeColors[grade.grade]}>{grade.grade}</Badge>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{grade.term}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
