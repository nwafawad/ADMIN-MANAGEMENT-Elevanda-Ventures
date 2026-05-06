const colorMap = {
  green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  yellow: 'bg-amber-100 text-amber-800 border-amber-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  gray: 'bg-gray-100 text-gray-700 border-gray-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
};

export default function Badge({ children, color = 'gray', className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border
        ${colorMap[color] || colorMap.gray} ${className}
      `}
    >
      {children}
    </span>
  );
}
