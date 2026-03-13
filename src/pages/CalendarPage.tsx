import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import {
  CheckCircleIcon,
  ClockIcon,
  UploadIcon,
  CopyIcon,
  FlameIcon,
  CalendarIcon } from
'lucide-react';
export function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  // Mock 30 days data
  const days = Array.from(
    {
      length: 30
    },
    (_, i) => {
      const dayNum = i + 1;
      let status: 'paid' | 'pending' | 'upcoming' = 'upcoming';
      if (dayNum <= 18) status = 'paid';
      if (dayNum === 19) status = 'pending';
      return {
        day: dayNum,
        status
      };
    }
  );
  const handleDayClick = (day: {day: number;status: string;}) => {
    if (day.status === 'pending' || day.status === 'upcoming') {
      setSelectedDay(day.day);
    }
  };
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
      className="space-y-8 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink tracking-tight">
            Daily Savings Tracker
          </h1>
          <p className="text-ink-secondary mt-1">Growth Plan • March 2026</p>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium bg-white px-5 py-2.5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ajo-500"></div>
            <span className="text-ink">Paid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <span className="text-ink">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
            <span className="text-ink">Upcoming</span>
          </div>
        </div>
      </div>

      <Card className="p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 sm:gap-6">
          {days.map((d) => {
            const isMostRecentPaid = d.day === 18;
            return (
              <motion.div
                key={d.day}
                whileHover={
                d.status !== 'paid' ?
                {
                  scale: 1.05
                } :
                {}
                }
                whileTap={
                d.status !== 'paid' ?
                {
                  scale: 0.95
                } :
                {}
                }
                onClick={() => handleDayClick(d)}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${d.status === 'paid' ? 'bg-ajo-50 border-2 border-ajo-200 cursor-default' : d.status === 'pending' ? 'bg-white border-2 border-amber-300 shadow-md ring-4 ring-amber-50' : 'bg-surface border-2 border-transparent hover:border-gray-200'}`}>
                
                {/* Pulse animation for most recent paid day */}
                {isMostRecentPaid &&
                <span className="absolute flex h-3 w-3 top-2 right-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ajo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-ajo-500"></span>
                  </span>
                }

                <span
                  className={`text-xl font-bold mb-1 ${d.status === 'paid' ? 'text-ajo-700' : d.status === 'pending' ? 'text-amber-700' : 'text-ink-secondary'}`}>
                  
                  {d.day}
                </span>

                {d.status === 'paid' &&
                <CheckCircleIcon className="w-6 h-6 text-ajo-500" />
                }
                {d.status === 'pending' &&
                <ClockIcon className="w-6 h-6 text-amber-500" />
                }
                {d.status === 'upcoming' &&
                <div className="w-6 h-1.5 bg-gray-200 rounded-full mt-2"></div>
                }
              </motion.div>);

          })}
        </div>
      </Card>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-ajo-50 flex items-center justify-center text-ajo-600">
            <FlameIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-0.5">
              Days Paid
            </p>
            <p className="text-xl font-bold text-ink">18</p>
          </div>
        </Card>
        <Card className="p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <ClockIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-0.5">
              Pending
            </p>
            <p className="text-xl font-bold text-ink">1</p>
          </div>
        </Card>
        <Card className="p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-ink-secondary">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-0.5">
              Remaining
            </p>
            <p className="text-xl font-bold text-ink">11</p>
          </div>
        </Card>
        <Card className="p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 36 36">
              
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#F3F4F6"
                strokeWidth="4" />
              
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#16A34A"
                strokeWidth="4"
                strokeDasharray="60, 100" />
              
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-0.5">
              Completion
            </p>
            <p className="text-xl font-bold text-ink">60%</p>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
        title={`Deposit for Day ${selectedDay}`}
        footer={
        <>
            <Button variant="ghost" onClick={() => setSelectedDay(null)}>
              Cancel
            </Button>
            <Button onClick={() => setSelectedDay(null)} className="rounded-xl">
              I Have Paid
            </Button>
          </>
        }>
        
        <div className="space-y-6">
          <div className="text-center bg-surface py-6 rounded-2xl border border-gray-100">
            <p className="text-ink-secondary font-medium mb-1">Amount to pay</p>
            <p className="text-5xl font-black text-ink tracking-tight">
              ₦1,000
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-4">
              Transfer Details
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-ink-secondary">Bank Name</span>
                <span className="font-bold text-ink">Guaranty Trust Bank</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-ink-secondary">Account Name</span>
                <span className="font-bold text-ink">
                  Greener Pastures Collections
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-sm text-ink-secondary">
                  Account Number
                </span>
                <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-gray-200">
                  <span className="font-bold text-lg text-ink tracking-wider">
                    0123456789
                  </span>
                  <button className="p-1 text-ajo-600 hover:bg-ajo-50 rounded-md transition-colors">
                    <CopyIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-ink mb-3">
              Upload Payment Proof
            </p>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-ajo-300 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-ajo-50 text-ajo-600 rounded-full flex items-center justify-center mb-4">
                <UploadIcon className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-ink">
                Click to upload screenshot
              </p>
              <p className="text-xs text-ink-muted mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>
        </div>
      </Modal>
    </motion.div>);

}