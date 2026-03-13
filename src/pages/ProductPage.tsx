import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  ArrowLeftIcon,
  StarIcon,
  ShieldCheckIcon,
  TruckIcon } from
'lucide-react';
export function ProductPage() {
  const { id } = useParams();
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
      className="space-y-8 max-w-6xl mx-auto pb-12">
      
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-2 text-sm font-bold text-ink-secondary hover:text-ink transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm w-fit">
        
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Marketplace
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div className="rounded-[2rem] overflow-hidden bg-surface aspect-square border border-gray-100 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=800&h=800"
            alt="Product"
            className="w-full h-full object-cover" />
          
        </div>

        <div className="flex flex-col py-4">
          <Badge variant="neutral" className="w-fit mb-6 px-3 py-1">
            Electronics
          </Badge>
          <h1 className="text-4xl font-bold text-ink mb-4 tracking-tight">
            iPhone 13 Pro - 256GB
          </h1>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1.5 text-sm font-bold text-ink bg-amber-50 px-2.5 py-1 rounded-md text-amber-700">
              <StarIcon className="w-4 h-4 fill-current" />
              4.8 (24 reviews)
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-sm font-medium text-ink-secondary">
              Condition: Used - Like New
            </span>
          </div>

          <p className="text-5xl font-black text-ajo-600 mb-10 tracking-tight">
            ₦450,000
          </p>

          <div className="space-y-4 mb-10 text-ink-secondary leading-relaxed text-lg">
            <p>
              Pristine condition iPhone 13 Pro with 256GB storage. Battery
              health is at 92%. Comes with original box and charging cable. No
              scratches or dents.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4 font-medium">
              <li>Sierra Blue color</li>
              <li>Unlocked to all networks</li>
              <li>Face ID works perfectly</li>
            </ul>
          </div>

          <div className="mt-auto space-y-6">
            <div className="flex items-center gap-4 p-5 bg-ajo-50 rounded-2xl border border-ajo-100">
              <ShieldCheckIcon className="w-6 h-6 text-ajo-600 shrink-0" />
              <span className="text-sm font-bold text-ajo-900">
                Greener Pastures Buyer Protection included
              </span>
            </div>

            <div className="flex gap-4">
              <Button
                className="flex-1 rounded-xl h-14 text-lg shadow-md"
                size="lg">
                
                Buy with Wallet
              </Button>
              <Button
                variant="secondary"
                className="rounded-xl h-14 px-8 text-lg border-gray-200"
                size="lg">
                
                Contact Seller
              </Button>
            </div>
            <p className="text-center text-sm font-medium text-ink-muted">
              Your wallet balance: <span className="text-ink">₦25,500</span>
            </p>
          </div>
        </div>
      </div>

      <Card className="mt-16 p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-6">
          About the Seller
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-gray-200 text-ink flex items-center justify-center text-2xl font-black">
              C
            </div>
            <div>
              <p className="font-bold text-ink text-xl mb-1">Chinedu E.</p>
              <p className="text-sm font-medium text-ink-secondary">
                Member since Jan 2025
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-sm font-bold text-ink justify-end mb-2">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-400" />
              4.8 Rating
            </div>
            <p className="text-sm font-medium text-ink-muted">12 items sold</p>
          </div>
        </div>
      </Card>
    </motion.div>);

}