const colorMap = {
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  yellow: 'bg-amber-100 text-amber-800 border-amber-200',
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  gray: 'bg-gray-100 text-gray-700 border-gray-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
};

export default function Badge({ children, color = 'gray', className = '', pulse = false }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border
        ${colorMap[color] || colorMap.gray} ${className}
      `}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorMap[color].split(' ')[1].replace('text-', 'bg-')}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${colorMap[color].split(' ')[1].replace('text-', 'bg-')}`}></span>
        </span>
      )}
      {children}
    </span>
  );
}
