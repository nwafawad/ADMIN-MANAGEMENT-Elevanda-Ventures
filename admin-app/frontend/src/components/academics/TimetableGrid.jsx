import { useState } from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const dayColors = {
  Monday: 'from-blue-500 to-blue-600',
  Tuesday: 'from-indigo-500 to-indigo-600',
  Wednesday: 'from-purple-500 to-purple-600',
  Thursday: 'from-cyan-500 to-cyan-600',
  Friday: 'from-teal-500 to-teal-600',
};

export default function TimetableGrid({ timetable }) {
  const [expandedDay, setExpandedDay] = useState(null);

  if (!timetable || Object.keys(timetable).length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-3 text-sm text-gray-500">No timetable available</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop grid */}
      <div className="hidden md:grid md:grid-cols-5 gap-3">
        {days.map((day) => (
          <div key={day} className="space-y-2">
            <div className={`bg-gradient-to-r ${dayColors[day]} text-white text-center py-2.5 rounded-lg text-sm font-semibold shadow-sm`}>
              {day}
            </div>
            <div className="space-y-2">
              {(timetable[day] || []).length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-3 text-center text-xs text-gray-400">
                  No classes
                </div>
              ) : (
                (timetable[day] || []).map((entry, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-100 rounded-lg p-3 hover:shadow-sm hover:border-gray-200 transition-all duration-200"
                  >
                    <p className="text-sm font-semibold text-gray-900">{entry.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">{entry.teacherName}</p>
                    <p className="text-xs text-primary-600 font-medium mt-1">
                      {entry.startTime} – {entry.endTime}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile accordion */}
      <div className="md:hidden space-y-2">
        {days.map((day) => (
          <div key={day} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedDay(expandedDay === day ? null : day)}
              className={`w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r ${dayColors[day]} text-white text-sm font-semibold cursor-pointer`}
            >
              <span>{day}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {(timetable[day] || []).length} classes
              </span>
            </button>
            {expandedDay === day && (
              <div className="p-3 space-y-2 animate-fade-in">
                {(timetable[day] || []).length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-2">No classes scheduled</p>
                ) : (
                  (timetable[day] || []).map((entry, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-semibold text-gray-900">{entry.subject}</p>
                      <p className="text-xs text-gray-500">{entry.teacherName}</p>
                      <p className="text-xs text-primary-600 font-medium mt-1">
                        {entry.startTime} – {entry.endTime}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
