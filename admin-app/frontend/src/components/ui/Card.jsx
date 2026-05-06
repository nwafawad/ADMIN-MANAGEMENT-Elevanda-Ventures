export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-100 shadow-sm
        ${hover ? 'hover:shadow-md hover:border-gray-200 transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}
