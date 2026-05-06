export default function Skeleton({ className = '', lines = 1 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton h-4 ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'} ${className}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-6 space-y-3 ${className}`}>
      <div className="skeleton h-5 w-1/3" />
      <div className="skeleton h-8 w-1/2" />
      <div className="skeleton h-4 w-2/3" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-4 p-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-3">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="skeleton h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
