'use client';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgColor: string;
}

export default function StatCard({ title, value, icon, iconBgColor }: StatCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-5 border border-gray-200/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mt-1.5">{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-2xl ${iconBgColor} flex items-center justify-center shadow-sm ring-1 ring-gray-200/50`}>
          {icon}
        </div>
      </div>
      {/* Creative progress bar */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full ${iconBgColor} rounded-full`} style={{width: '65%'}}></div>
          </div>
          <span className="text-xs text-gray-500 font-medium">65%</span>
        </div>
      </div>
    </div>
  );
}
