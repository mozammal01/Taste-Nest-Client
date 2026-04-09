"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface DashboardChartsProps {
  revenueTrend: { name: string; total: number }[];
  orderDistribution: { name: string; value: number }[];
}

const COLORS = ['#f3274c', '#ffd40d', '#10b981', '#3b82f6', '#8b5cf6'];

export function DashboardCharts({ revenueTrend, orderDistribution }: DashboardChartsProps) {
  // Fill in mock data if empty to show the chart during development/first run
  const displayTrend = revenueTrend.length > 0 ? revenueTrend : [
    { name: 'Jan', total: 400 },
    { name: 'Feb', total: 300 },
    { name: 'Mar', total: 600 },
    { name: 'Apr', total: 800 },
    { name: 'May', total: 500 },
    { name: 'Jun', total: 900 },
  ];

  const displayDist = orderDistribution.length > 0 ? orderDistribution : [
    { name: 'Pending', value: 400 },
    { name: 'Completed', value: 300 },
    { name: 'Cancelled', value: 100 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
      {/* Revenue Trend Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl group">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Revenue <span className="text-primary italic">Analytics</span></h3>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">Last 6 Months Trend</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <BarChart className="w-5 h-5 text-primary" />
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayTrend}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f3274c" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f3274c" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                }}
                itemStyle={{ fontWeight: 800, color: '#f3274c' }}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#f3274c" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Distribution Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl group">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Order <span className="text-primary italic">Distribution</span></h3>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">Status Overview</p>
          </div>
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <PieChart className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        <div className="h-[300px] w-full flex flex-col sm:flex-row items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayDist}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
                animationDuration={1500}
                cornerRadius={8}
              >
                {displayDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
