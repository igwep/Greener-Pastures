import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ArrowDownLeftIcon, ArrowUpRightIcon, PlusIcon } from 'lucide-react';
const transactions = [
{
  id: 1,
  desc: 'Daily Contribution - Day 18',
  date: 'Mar 12, 2026 • 09:41 AM',
  amount: -1000,
  status: 'Completed',
  type: 'debit',
  ref: 'TRX-89231'
},
{
  id: 2,
  desc: 'Marketplace Sale (AirPods)',
  date: 'Mar 11, 2026 • 14:20 PM',
  amount: 5000,
  status: 'Completed',
  type: 'credit',
  ref: 'MKT-44512'
},
{
  id: 3,
  desc: 'Daily Contribution - Day 17',
  date: 'Mar 11, 2026 • 08:15 AM',
  amount: -1000,
  status: 'Completed',
  type: 'debit',
  ref: 'TRX-89230'
},
{
  id: 4,
  desc: 'Withdrawal to GTBank',
  date: 'Mar 10, 2026 • 16:30 PM',
  amount: -3000,
  status: 'Pending',
  type: 'debit',
  ref: 'WDL-11029'
},
{
  id: 5,
  desc: 'Ajo Payout - Starter Plan',
  date: 'Feb 28, 2026 • 10:00 AM',
  amount: 15000,
  status: 'Completed',
  type: 'credit',
  ref: 'PAY-99210'
}];

export function WalletPage() {
  const [activeTab, setActiveTab] = useState('all');
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="space-y-8 max-w-5xl mx-auto pb-12">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-ink tracking-tight">Wallet</h1>
      </div>

      <Card className="bg-ajo-900 text-white overflow-hidden relative p-10 rounded-[2rem] border-none shadow-lg">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
            'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-ajo-500 opacity-30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-ajo-200 text-sm font-bold uppercase tracking-widest mb-3">
              Available Balance
            </p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight">
              ₦25,500
            </h2>
          </div>
          <div className="flex gap-4">
            <Button className="bg-white text-ajo-900 hover:bg-gray-100 rounded-xl h-12 px-6 font-semibold">
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Money
            </Button>
            <Link to="/withdraw">
              <Button
                variant="secondary"
                className="bg-transparent border-ajo-700 text-white hover:bg-ajo-800 rounded-xl h-12 px-6 font-semibold">
                
                Withdraw
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
        <div className="border-b border-gray-100 px-8 flex gap-8 bg-surface">
          {['all', 'deposits', 'withdrawals'].map((tab) =>
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-5 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === tab ? 'text-ajo-600' : 'text-ink-secondary hover:text-ink'}`}>
            
              {tab}
              {activeTab === tab &&
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-ajo-600" />

            }
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-100">
          {transactions.map((tx) =>
          <div
            key={tx.id}
            className="p-6 sm:px-8 flex items-center justify-between hover:bg-gray-50 transition-colors group">
            
              <div className="flex items-center gap-5">
                <div
                className={`p-3.5 rounded-2xl transition-colors ${tx.type === 'credit' ? 'bg-ajo-50 text-ajo-600 group-hover:bg-ajo-100' : 'bg-surface text-ink-secondary group-hover:bg-gray-200'}`}>
                
                  {tx.type === 'credit' ?
                <ArrowDownLeftIcon className="w-6 h-6" /> :

                <ArrowUpRightIcon className="w-6 h-6" />
                }
                </div>
                <div>
                  <p className="font-bold text-ink text-base">{tx.desc}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm text-ink-muted">{tx.date}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-ink-muted font-mono bg-surface px-1.5 py-0.5 rounded border border-gray-200">
                      {tx.ref}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                className={`font-black text-xl tracking-tight ${tx.type === 'credit' ? 'text-ajo-600' : 'text-ink'}`}>
                
                  {tx.amount > 0 ? '+' : ''}₦
                  {Math.abs(tx.amount).toLocaleString()}
                </p>
                <Badge
                variant={tx.status === 'Completed' ? 'success' : 'warning'}
                className="mt-2">
                
                  {tx.status}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>);

}