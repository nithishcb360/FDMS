'use client';

const actions = [
  {
    name: 'New Case',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    color: 'text-blue-700',
    bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100',
    hoverColor: 'hover:from-blue-100 hover:to-blue-200',
    href: '/cases/new',
  },
  {
    name: 'All Cases',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    color: 'text-purple-700',
    bgColor: 'bg-gradient-to-r from-purple-50 to-purple-100',
    hoverColor: 'hover:from-purple-100 hover:to-purple-200',
    href: '/cases',
  },
  {
    name: 'Schedule',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'text-green-700',
    bgColor: 'bg-gradient-to-r from-green-50 to-green-100',
    hoverColor: 'hover:from-green-100 hover:to-green-200',
    href: '/schedule',
  },
  {
    name: 'Staff Management',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: 'text-orange-700',
    bgColor: 'bg-gradient-to-r from-orange-50 to-orange-100',
    hoverColor: 'hover:from-orange-100 hover:to-orange-200',
    href: '/staff',
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden border border-gray-200/50">
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 px-5 py-3 flex items-center gap-2 border-b border-indigo-200/50">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-sm font-bold text-gray-800">Quick Actions</h2>
      </div>
      <div className="p-3 space-y-2">
        {actions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl ${action.bgColor} ${action.color} ${action.hoverColor} transition-all duration-200 border border-gray-100 shadow-sm hover:shadow-md group`}
          >
            <span className="flex-shrink-0 group-hover:scale-110 transition-transform">{action.icon}</span>
            <span className="font-semibold text-sm">{action.name}</span>
            <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
