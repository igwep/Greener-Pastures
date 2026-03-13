import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { BuildingIcon, AlertCircleIcon } from 'lucide-react';
export function WithdrawPage() {
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
      className="space-y-8 max-w-4xl mx-auto pb-12">
      
      <h1 className="text-3xl font-bold text-ink tracking-tight">
        Withdraw Funds
      </h1>

      <div className="grid md:grid-cols-5 gap-8">
        <Card className="flex flex-col md:col-span-3 p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="mb-8 p-6 bg-surface rounded-2xl border border-gray-200">
            <p className="text-ink-secondary text-xs font-bold uppercase tracking-widest mb-2">
              Available Balance
            </p>
            <h2 className="text-4xl font-black text-ink tracking-tight">
              ₦25,500
            </h2>
          </div>

          <form className="space-y-8 flex-1 flex flex-col">
            <div className="relative">
              <span className="absolute left-5 top-10 text-ink font-bold text-xl">
                ₦
              </span>
              <Input
                label="Amount to withdraw"
                type="number"
                placeholder="0.00"
                className="pl-10 text-2xl font-bold h-16 rounded-xl" />
              
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                  Destination Bank
                </span>
                <button
                  type="button"
                  className="text-sm font-bold text-ajo-600 hover:text-ajo-700 transition-colors">
                  
                  Change
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface rounded-xl border border-gray-200 flex items-center justify-center text-ink-secondary">
                  <BuildingIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-ink text-base">
                    Guaranty Trust Bank
                  </p>
                  <p className="text-sm text-ink-secondary mt-0.5">
                    0123456789 • Adaeze Okonkwo
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <Button className="w-full rounded-xl h-14 text-lg" size="lg">
                Request Withdrawal
              </Button>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-ink-secondary">
                <AlertCircleIcon className="w-4 h-4" />
                <span>Withdrawals are processed within 24 hours</span>
              </div>
            </div>
          </form>
        </Card>

        <div className="space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-ink-muted mb-6">
            Recent Withdrawals
          </h3>

          {[
          {
            date: 'Mar 10, 2026',
            amount: 3000,
            status: 'Pending'
          },
          {
            date: 'Feb 28, 2026',
            amount: 15000,
            status: 'Paid'
          },
          {
            date: 'Jan 15, 2026',
            amount: 5000,
            status: 'Paid'
          }].
          map((w, i) =>
          <Card
            key={i}
            className="p-5 flex items-center justify-between rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            
              <div>
                <p className="font-bold text-ink text-lg">
                  ₦{w.amount.toLocaleString()}
                </p>
                <p className="text-sm text-ink-secondary mt-1">{w.date}</p>
              </div>
              <Badge variant={w.status === 'Paid' ? 'success' : 'warning'}>
                {w.status}
              </Badge>
            </Card>
          )}
        </div>
      </div>
    </motion.div>);

}