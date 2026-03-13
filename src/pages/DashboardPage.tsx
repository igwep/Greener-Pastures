import React, { useState, Children } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  WalletIcon,
  TargetIcon,
  TrendingUpIcon,
  ClockIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  PlusIcon } from
'lucide-react';
const chartData = [
{
  day: 'Day 1',
  amount: 1000
},
{
  day: 'Day 5',
  amount: 5000
},
{
  day: 'Day 10',
  amount: 10000
},
{
  day: 'Day 15',
  amount: 15000
},
{
  day: 'Day 18',
  amount: 18000
}];

const transactions = [
{
  id: 1,
  desc: 'Daily Contribution - Day 18',
  date: 'Today, 09:41 AM',
  amount: -1000,
  status: 'Completed',
  type: 'debit',
  group: 'Today'
},
{
  id: 2,
  desc: 'Marketplace Sale (AirPods)',
  date: 'Yesterday, 14:20 PM',
  amount: 5000,
  status: 'Completed',
  type: 'credit',
  group: 'Yesterday'
},
{
  id: 3,
  desc: 'Daily Contribution - Day 17',
  date: 'Yesterday, 08:15 AM',
  amount: -1000,
  status: 'Completed',
  type: 'debit',
  group: 'Yesterday'
},
{
  id: 4,
  desc: 'Withdrawal to GTBank',
  date: 'Mar 10, 2026',
  amount: -3000,
  status: 'Pending',
  type: 'debit',
  group: 'Older'
}];

export function DashboardPage() {
  const [chartPeriod, setChartPeriod] = useState('30D');
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0
    }
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink tracking-tight">
            Good morning, Adaeze 👋
          </h1>
          <p className="text-ink-secondary mt-1">Thursday, March 12, 2026</p>
        </div>
        <div className="flex gap-3">
          <Link to="/calendar">
            <Button className="rounded-xl shadow-sm">Make Deposit</Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Wallet Card - Spans 2 columns */}
        <Card
          variants={itemVariants}
          as={motion.div}
          className="animated-border animated-border-dark md:col-span-2 bg-ajo-900 text-white relative overflow-visible flex flex-col justify-between p-8 rounded-3xl border-none shadow-lg">
          
          <div
            className="absolute inset-0 opacity-20 rounded-3xl"
            style={{
              backgroundImage:
              'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-ajo-500 rounded-full blur-[80px] opacity-30 -translate-y-1/2 translate-x-1/3"></div>

          <div className="relative z-10 flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-ajo-100">
              <WalletIcon className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Wallet Balance
              </span>
            </div>
            {/* Sparkline placeholder */}
            <div className="w-24 h-8 flex items-end gap-1 opacity-70">
              {[4, 6, 5, 8, 7, 10, 12].map((h, i) =>
              <div
                key={i}
                className="w-full bg-ajo-400 rounded-t-sm"
                style={{
                  height: `${h * 8}%`
                }}>
              </div>
              )}
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="text-5xl font-bold mb-1 tracking-tight">
                ₦25,500
              </div>
              <div className="text-sm text-ajo-200">
                Available for withdrawal
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-ajo-900 hover:bg-gray-100 rounded-xl h-10 px-4 text-sm font-semibold">
                <PlusIcon className="w-4 h-4 mr-1.5" /> Add Money
              </Button>
              <Link to="/withdraw">
                <Button
                  variant="secondary"
                  className="bg-transparent border-ajo-700 text-white hover:bg-ajo-800 rounded-xl h-10 px-4 text-sm font-semibold">
                  
                  Withdraw
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Active Plan */}
        <Card
          variants={itemVariants}
          as={motion.div}
          className="animated-border flex flex-col p-6 rounded-3xl border-none shadow-sm overflow-visible bg-white">
          
          <div className="flex items-center justify-between mb-6">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <TargetIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
              Active Plan
            </span>
          </div>
          <div className="flex items-center gap-4 mb-2">
            {/* Circular Progress Ring */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36">
                
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#F3F4F6"
                  strokeWidth="3" />
                
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray="60, 100" />
                
              </svg>
              <span className="absolute text-xs font-bold text-ink">60%</span>
            </div>
            <div>
              <div className="text-xl font-bold text-ink">Growth Plan</div>
              <div className="text-sm text-ink-secondary">₦1,000 daily</div>
            </div>
          </div>
        </Card>

        {/* Total Saved */}
        <Card
          variants={itemVariants}
          as={motion.div}
          className="animated-border flex flex-col p-6 rounded-3xl border-none shadow-sm overflow-visible bg-white">
          
          <div className="flex items-center justify-between mb-6">
            <div className="p-2.5 bg-ajo-50 text-ajo-600 rounded-xl">
              <TrendingUpIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
              Total Saved
            </span>
          </div>
          <div className="text-3xl font-bold text-ink mb-2 tracking-tight">
            ₦18,000
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="flex items-center text-ajo-600 font-medium bg-ajo-50 px-1.5 py-0.5 rounded-md">
              <ArrowUpRightIcon className="w-3 h-3 mr-0.5" /> +₦3,000
            </span>
            <span className="text-ink-muted">this week</span>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart */}
        <Card
          variants={itemVariants}
          as={motion.div}
          className="animated-border lg:col-span-2 p-6 rounded-3xl border-none shadow-sm overflow-visible bg-white">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-xl font-bold text-ink">Savings Progress</h2>
              <p className="text-sm text-ink-secondary mt-1">
                Growth Plan performance
              </p>
            </div>
            <div className="flex bg-surface p-1 rounded-xl border border-gray-100">
              {['7D', '30D', 'All'].map((period) =>
              <button
                key={period}
                onClick={() => setChartPeriod(period)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${chartPeriod === period ? 'bg-white text-ink shadow-sm' : 'text-ink-secondary hover:text-ink'}`}>
                
                  {period}
                </button>
              )}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0
                }}>
                
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F3F4F6" />
                
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#9CA3AF',
                    fontSize: 12
                  }}
                  dy={10} />
                
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#9CA3AF',
                    fontSize: 12
                  }}
                  tickFormatter={(val) => `₦${val}`}
                  dx={-10} />
                
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number) => [`₦${value}`, 'Saved']} />
                
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#16A34A"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                  activeDot={{
                    r: 6,
                    strokeWidth: 0,
                    fill: '#16A34A'
                  }} />
                
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card
          variants={itemVariants}
          as={motion.div}
          className="animated-border flex flex-col p-6 rounded-3xl border-none shadow-sm overflow-visible bg-white">
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-ink">Recent Activity</h2>
            <Link
              to="/wallet"
              className="text-sm font-semibold text-ajo-600 hover:text-ajo-700 bg-ajo-50 px-3 py-1.5 rounded-lg transition-colors">
              
              View all
            </Link>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {/* Group: Today */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-4">
                Today
              </h3>
              <div className="space-y-4">
                {transactions.
                filter((t) => t.group === 'Today').
                map((tx) =>
                <div key={tx.id} className="flex items-center gap-4 group">
                      <div
                    className={`p-2.5 rounded-xl shrink-0 transition-colors ${tx.type === 'credit' ? 'bg-ajo-50 text-ajo-600 group-hover:bg-ajo-100' : 'bg-surface text-ink-secondary group-hover:bg-gray-200'}`}>
                    
                        {tx.type === 'credit' ?
                    <ArrowDownLeftIcon className="w-4 h-4" /> :

                    <ArrowUpRightIcon className="w-4 h-4" />
                    }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">
                          {tx.desc}
                        </p>
                        <p className="text-xs text-ink-muted mt-0.5">
                          {tx.date.split(', ')[1]}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                      className={`text-sm font-bold ${tx.type === 'credit' ? 'text-ajo-600' : 'text-ink'}`}>
                      
                          {tx.amount > 0 ? '+' : ''}₦
                          {Math.abs(tx.amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                )}
              </div>
            </div>

            {/* Group: Yesterday */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-4">
                Yesterday
              </h3>
              <div className="space-y-4">
                {transactions.
                filter((t) => t.group === 'Yesterday').
                map((tx) =>
                <div key={tx.id} className="flex items-center gap-4 group">
                      <div
                    className={`p-2.5 rounded-xl shrink-0 transition-colors ${tx.type === 'credit' ? 'bg-ajo-50 text-ajo-600 group-hover:bg-ajo-100' : 'bg-surface text-ink-secondary group-hover:bg-gray-200'}`}>
                    
                        {tx.type === 'credit' ?
                    <ArrowDownLeftIcon className="w-4 h-4" /> :

                    <ArrowUpRightIcon className="w-4 h-4" />
                    }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">
                          {tx.desc}
                        </p>
                        <p className="text-xs text-ink-muted mt-0.5">
                          {tx.date.split(', ')[1]}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                      className={`text-sm font-bold ${tx.type === 'credit' ? 'text-ajo-600' : 'text-ink'}`}>
                      
                          {tx.amount > 0 ? '+' : ''}₦
                          {Math.abs(tx.amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>);

}