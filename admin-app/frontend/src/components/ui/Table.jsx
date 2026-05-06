import { SkeletonTable } from './Skeleton';

export default function Table({ columns, data, isLoading, emptyMessage = 'No data available' }) {
  if (isLoading) {
    return <SkeletonTable cols={columns.length} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-100 rounded-lg bg-white">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900">{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className={`hover:bg-gray-50/50 transition-colors ${row.isRowHighlighted ? 'bg-amber-50/50' : ''}`}>
              {columns.map((col, colIndex) => (
                <td key={col.key || colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
