import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { CameraIcon } from 'lucide-react';
export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
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
      
      <h1 className="text-3xl font-bold text-ink tracking-tight">
        Profile Settings
      </h1>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-72 shrink-0 space-y-2">
          {[
          {
            id: 'personal',
            label: 'Personal Information'
          },
          {
            id: 'bank',
            label: 'Bank Details'
          },
          {
            id: 'security',
            label: 'Security Settings'
          }].
          map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-ink text-white shadow-md' : 'text-ink-secondary hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100'}`}>
            
              {tab.label}
            </button>
          )}
        </div>

        <Card className="flex-1 p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
          {activeTab === 'personal' &&
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="space-y-8">
            
              <div className="flex items-center gap-8 pb-8 border-b border-gray-100">
                <div className="relative">
                  <Avatar
                  initials="AO"
                  size="lg"
                  className="w-24 h-24 text-3xl shadow-sm border-4 border-white" />
                
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-ink hover:text-ajo-600 transition-colors">
                    <CameraIcon className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-ink text-2xl mb-1">
                    Adaeze Okonkwo
                  </h3>
                  <p className="text-base text-ink-secondary">
                    adaeze@example.com
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <Input
                label="Full Name"
                defaultValue="Adaeze Okonkwo"
                className="h-12 rounded-xl" />
              
                <Input
                label="Email Address"
                type="email"
                defaultValue="adaeze@example.com"
                className="h-12 rounded-xl" />
              
                <Input
                label="Phone Number"
                type="tel"
                defaultValue="08012345678"
                className="h-12 rounded-xl" />
              
              </div>

              <div className="pt-6">
                <Button className="rounded-xl h-12 px-8">Save Changes</Button>
              </div>
            </motion.div>
          }

          {activeTab === 'bank' &&
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="space-y-8">
            
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink-muted pb-4 border-b border-gray-100">
                Withdrawal Account
              </h3>

              <div className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">
                    Bank Name
                  </label>
                  <select className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-ink focus:outline-none focus:ring-2 focus:ring-ajo-600/20 focus:border-ajo-600 transition-all appearance-none shadow-sm">
                    <option>Guaranty Trust Bank</option>
                    <option>Access Bank</option>
                    <option>First Bank of Nigeria</option>
                    <option>United Bank for Africa</option>
                    <option>Zenith Bank</option>
                  </select>
                </div>

                <Input
                label="Account Number"
                defaultValue="0123456789"
                className="h-12 rounded-xl shadow-sm" />
              

                <Input
                label="Account Name"
                defaultValue="Adaeze Okonkwo"
                disabled
                className="bg-surface text-ink-muted h-12 rounded-xl border-gray-100" />
              
              </div>

              <div className="pt-6">
                <Button className="rounded-xl h-12 px-8">
                  Update Bank Details
                </Button>
              </div>
            </motion.div>
          }

          {activeTab === 'security' &&
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="space-y-8">
            
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink-muted pb-4 border-b border-gray-100">
                Change Password
              </h3>

              <div className="space-y-6 max-w-md">
                <Input
                label="Current Password"
                type="password"
                className="h-12 rounded-xl shadow-sm" />
              
                <Input
                label="New Password"
                type="password"
                className="h-12 rounded-xl shadow-sm" />
              
                <Input
                label="Confirm New Password"
                type="password"
                className="h-12 rounded-xl shadow-sm" />
              
              </div>

              <div className="pt-4 pb-8 border-b border-gray-100">
                <Button className="rounded-xl h-12 px-8">
                  Update Password
                </Button>
              </div>

              <div className="flex items-center justify-between pt-4 bg-surface p-6 rounded-2xl border border-gray-100">
                <div>
                  <h4 className="font-bold text-ink text-lg mb-1">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-sm font-medium text-ink-secondary">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-ajo-600 focus:ring-offset-2">
                  <span className="inline-block h-5 w-5 translate-x-1 rounded-full bg-white transition-transform shadow-sm" />
                </button>
              </div>
            </motion.div>
          }
        </Card>
      </div>
    </motion.div>);

}