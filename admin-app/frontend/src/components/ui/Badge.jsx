const colorMap = {
  green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  yellow: 'bg-amber-100 text-amber-800 border-amber-200',
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  gray: 'bg-gray-100 text-gray-700 border-gray-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
};

export default function Badge({ children, color = 'gray', className = '', pulse = false }) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border relative
        ${colorMap[color] || colorMap.gray} ${className}
      `}
    >
      {pulse && (
        <span className="flex absolute h-2 w-2 -top-0.5 -right-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      )}
      {children}
    </span>
  );
}
