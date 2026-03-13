import React, { Children } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import {
  CheckCircleIcon,
  TargetIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  WalletIcon,
  ArrowRightIcon,
  SproutIcon,
  StarIcon,
  FlameIcon } from
'lucide-react';
export function LandingPage() {
  const fadeIn = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  const staggerContainer = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  return (
    <div className="min-h-screen bg-surface font-sans selection:bg-ajo-200 selection:text-ajo-900">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ajo-600 rounded-xl flex items-center justify-center shadow-sm">
              <SproutIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-ink">
              Greener Pastures
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-secondary">
            <a
              href="#how-it-works"
              className="hover:text-ajo-600 transition-colors">
              
              How it Works
            </a>
            <a href="#plans" className="hover:text-ajo-600 transition-colors">
              Plans
            </a>
            <a
              href="#marketplace"
              className="hover:text-ajo-600 transition-colors">
              
              Marketplace
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-ink hover:text-ajo-600 transition-colors hidden sm:block">
              
              Sign In
            </Link>
            <Link to="/register">
              <Button className="rounded-xl">Start Growing</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-4 overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-ajo-50 to-transparent rounded-full blur-3xl -z-10 opacity-70"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-2xl">
            
            <Badge
              variant="success"
              className="mb-8 px-4 py-1.5 text-sm rounded-full bg-ajo-100 text-ajo-800 border border-ajo-200">
              
              🌱 Trusted by 10,000+ savers
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold text-ink leading-[1.1] mb-6 tracking-tight">
              Your money,
              <br />
              <span className="text-ajo-600 relative">
                growing daily.
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-ajo-200 -z-10"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none">
                  
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent" />
                  
                </svg>
              </span>
            </h1>
            <p className="text-xl text-ink-secondary mb-10 leading-relaxed max-w-lg">
              Join thousands of Nigerians building wealth through transparent
              daily savings. Track every contribution, watch your balance grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 rounded-xl h-14">
                  
                  Start Growing
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-6 h-14 group">
                  
                  See How It Works
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
            <div className="mt-12 flex items-center gap-4 text-sm text-ink-secondary font-medium">
              <div className="flex -space-x-3">
                <Avatar
                  initials="AO"
                  src="https://i.pravatar.cc/100?img=1"
                  size="md"
                  className="border-2 border-surface" />
                
                <Avatar
                  initials="CO"
                  src="https://i.pravatar.cc/100?img=2"
                  size="md"
                  className="border-2 border-surface" />
                
                <Avatar
                  initials="EK"
                  src="https://i.pravatar.cc/100?img=3"
                  size="md"
                  className="border-2 border-surface" />
                
                <Avatar
                  initials="+"
                  size="md"
                  className="border-2 border-surface bg-gray-100 text-ink" />
                
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-400">
                  <StarIcon className="w-4 h-4 fill-current" />
                  <StarIcon className="w-4 h-4 fill-current" />
                  <StarIcon className="w-4 h-4 fill-current" />
                  <StarIcon className="w-4 h-4 fill-current" />
                  <StarIcon className="w-4 h-4 fill-current" />
                </div>
                <span>Rated 4.9/5 by our community</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual - Mockup */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              duration: 0.8,
              delay: 0.2
            }}
            className="relative lg:ml-auto w-full max-w-md">
            
            {/* Floating Badges */}
            <motion.div
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: 'easeInOut'
              }}
              className="absolute -left-12 top-12 z-20 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center gap-3">
              
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <FlameIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-ink-muted font-medium">
                  Current Streak
                </p>
                <p className="text-sm font-bold text-ink">18 Days 🔥</p>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: 'easeInOut',
                delay: 1
              }}
              className="absolute -right-8 bottom-24 z-20 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
              
              <p className="text-xs text-ink-muted font-medium mb-1">
                Total Saved
              </p>
              <p className="text-xl font-bold text-ajo-600">₦18,000</p>
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-tr from-ajo-200 to-ajo-50 rounded-[2.5rem] transform rotate-3 scale-105 -z-10"></div>
            <Card className="border border-gray-100 shadow-2xl rounded-[2rem] p-8 bg-white/95 backdrop-blur-sm relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-ink">Growth Plan</h3>
                  <p className="text-sm text-ink-muted">
                    ₦1,000 Daily Contribution
                  </p>
                </div>
                <Badge
                  variant="success"
                  className="bg-ajo-100 text-ajo-700 border border-ajo-200">
                  
                  Active
                </Badge>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-6">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) =>
                <div
                  key={i}
                  className="text-center text-xs font-bold text-ink-muted mb-2">
                  
                    {d}
                  </div>
                )}
                {Array.from({
                  length: 14
                }).map((_, i) => {
                  const isPaid = i < 10;
                  const isPending = i === 10;
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${isPaid ? 'bg-ajo-500 text-white shadow-sm' : isPending ? 'bg-white text-amber-600 border-2 border-amber-400 shadow-sm ring-4 ring-amber-50' : 'bg-surface text-ink-muted border border-gray-100'}`}>
                      
                      {isPaid ? <CheckCircleIcon className="w-5 h-5" /> : i + 1}
                    </div>);

                })}
              </div>

              <div className="bg-surface p-5 rounded-2xl flex items-center justify-between border border-gray-100">
                <div>
                  <p className="text-xs font-medium text-ink-muted mb-1">
                    Next Deposit
                  </p>
                  <p className="text-lg font-bold text-ink">Day 11</p>
                </div>
                <Button size="sm" className="rounded-xl shadow-md">
                  Pay ₦1,000
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-32 bg-white relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-bold tracking-widest text-ajo-600 uppercase mb-3">
              Simple Process
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight">
              How Greener Pastures Works
            </h2>
            <p className="text-xl text-ink-secondary">
              A simple, transparent, and secure way to build your savings habit.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-100px'
            }}
            className="grid md:grid-cols-3 gap-12 relative">
            
            {/* Desktop connector line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gray-100 -z-10"></div>

            {[
            {
              num: '01',
              icon: TargetIcon,
              title: 'Choose a Plan',
              desc: 'Pick a savings plan that fits your daily budget and financial goals. From ₦500 to ₦5,000 daily.'
            },
            {
              num: '02',
              icon: TrendingUpIcon,
              title: 'Save Daily',
              desc: 'Make daily contributions easily and track your progress on our visual calendar. Build your streak.'
            },
            {
              num: '03',
              icon: WalletIcon,
              title: 'Get Your Payout',
              desc: 'Receive your full savings securely in your wallet at maturity. Withdraw instantly to your bank.'
            }].
            map((step, i) =>
            <motion.div
              key={i}
              variants={fadeIn}
              className="animated-border relative bg-white p-8 rounded-3xl border-none shadow-sm overflow-visible">
              
                <div className="absolute -top-6 -right-4 text-[120px] font-black text-gray-50/80 leading-none select-none -z-10">
                  {step.num}
                </div>
                <div className="w-16 h-16 bg-ajo-50 rounded-2xl flex items-center justify-center mb-8 text-ajo-600 border border-ajo-100 shadow-sm">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-ink mb-4">
                  {step.title}
                </h3>
                <p className="text-ink-secondary leading-relaxed text-lg">
                  {step.desc}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Popular Plans */}
      <section id="plans" className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-sm font-bold tracking-widest text-ajo-600 uppercase mb-3">
              Flexible Options
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight">
              Savings Plans for Everyone
            </h2>
            <p className="text-xl text-ink-secondary max-w-2xl mx-auto">
              Start small or go big. Choose a plan that matches your financial
              capacity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Starter Plan */}
            <Card className="animated-border relative flex flex-col p-10 rounded-[2rem] border-none shadow-md overflow-visible bg-white">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 text-ink-secondary">
                <TargetIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-ink mb-2">Starter Plan</h3>
              <p className="text-ink-secondary mb-6">Perfect for beginners</p>
              <div className="flex items-end gap-1 mb-8 pb-8 border-b border-gray-100">
                <span className="text-5xl font-black text-ink tracking-tight">
                  ₦500
                </span>
                <span className="text-ink-muted mb-1 font-medium">/day</span>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                <li className="flex items-center gap-4 text-ink-secondary font-medium">
                  <div className="w-6 h-6 rounded-full bg-ajo-50 flex items-center justify-center text-ajo-600 shrink-0">
                    <CheckCircleIcon className="w-4 h-4" />
                  </div>
                  30 days duration
                </li>
                <li className="flex items-center gap-4 text-ink-secondary font-medium">
                  <div className="w-6 h-6 rounded-full bg-ajo-50 flex items-center justify-center text-ajo-600 shrink-0">
                    <CheckCircleIcon className="w-4 h-4" />
                  </div>
                  ₦15,000 total payout
                </li>
              </ul>
              <Link to="/register" className="mt-auto">
                <Button
                  variant="secondary"
                  className="w-full rounded-xl h-14 text-lg border-gray-200">
                  
                  Join Starter
                </Button>
              </Link>
            </Card>

            {/* Growth Plan (Popular) */}
            <Card className="animated-border animated-border-dark relative flex flex-col p-10 rounded-[2rem] border-none shadow-2xl scale-105 z-10 bg-ajo-900 text-white overflow-visible">
              {/* Decorative mesh/gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-ajo-500 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-ajo-700 opacity-30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

              <div className="absolute top-0 inset-x-0 flex justify-center -mt-4">
                <span className="bg-ajo-400 text-ajo-950 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </span>
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-ajo-300 backdrop-blur-sm">
                  <TrendingUpIcon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Growth Plan
                </h3>
                <p className="text-ajo-200 mb-6">For consistent savers</p>
                <div className="flex items-end gap-1 mb-8 pb-8 border-b border-white/10">
                  <span className="text-5xl font-black text-white tracking-tight">
                    ₦1,000
                  </span>
                  <span className="text-ajo-300 mb-1 font-medium">/day</span>
                </div>
                <ul className="space-y-5 mb-10 flex-1">
                  <li className="flex items-center gap-4 text-ajo-100 font-medium">
                    <div className="w-6 h-6 rounded-full bg-ajo-500/30 flex items-center justify-center text-ajo-300 shrink-0">
                      <CheckCircleIcon className="w-4 h-4" />
                    </div>
                    30 days duration
                  </li>
                  <li className="flex items-center gap-4 text-ajo-100 font-medium">
                    <div className="w-6 h-6 rounded-full bg-ajo-500/30 flex items-center justify-center text-ajo-300 shrink-0">
                      <CheckCircleIcon className="w-4 h-4" />
                    </div>
                    ₦30,000 total payout
                  </li>
                  <li className="flex items-center gap-4 text-ajo-100 font-medium">
                    <div className="w-6 h-6 rounded-full bg-ajo-500/30 flex items-center justify-center text-ajo-300 shrink-0">
                      <CheckCircleIcon className="w-4 h-4" />
                    </div>
                    Marketplace access
                  </li>
                </ul>
                <Link to="/register" className="mt-auto">
                  <Button className="w-full rounded-xl h-14 text-lg bg-white text-ajo-900 hover:bg-gray-100">
                    Join Growth
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Premium Plan */}
            <Card className="animated-border relative flex flex-col p-10 rounded-[2rem] border-none shadow-md overflow-visible bg-white">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 text-ink-secondary">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-ink mb-2">Premium Plan</h3>
              <p className="text-ink-secondary mb-6">
                For serious wealth building
              </p>
              <div className="flex items-end gap-1 mb-8 pb-8 border-b border-gray-100">
                <span className="text-5xl font-black text-ink tracking-tight">
                  ₦5,000
                </span>
                <span className="text-ink-muted mb-1 font-medium">/day</span>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                <li className="flex items-center gap-4 text-ink-secondary font-medium">
                  <div className="w-6 h-6 rounded-full bg-ajo-50 flex items-center justify-center text-ajo-600 shrink-0">
                    <CheckCircleIcon className="w-4 h-4" />
                  </div>
                  30 days duration
                </li>
                <li className="flex items-center gap-4 text-ink-secondary font-medium">
                  <div className="w-6 h-6 rounded-full bg-ajo-50 flex items-center justify-center text-ajo-600 shrink-0">
                    <CheckCircleIcon className="w-4 h-4" />
                  </div>
                  ₦150,000 total payout
                </li>
                <li className="flex items-center gap-4 text-ink-secondary font-medium">
                  <div className="w-6 h-6 rounded-full bg-ajo-50 flex items-center justify-center text-ajo-600 shrink-0">
                    <CheckCircleIcon className="w-4 h-4" />
                  </div>
                  Priority support
                </li>
              </ul>
              <Link to="/register" className="mt-auto">
                <Button
                  variant="secondary"
                  className="w-full rounded-xl h-14 text-lg border-gray-200">
                  
                  Join Premium
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators - Lighter approach */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="text-5xl font-black text-ink mb-2 tracking-tight">
                10k+
              </div>
              <div className="w-12 h-1 bg-ajo-600 rounded-full mb-4"></div>
              <div className="text-ink-secondary font-medium">
                Active Savers
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-black text-ink mb-2 tracking-tight">
                ₦500M+
              </div>
              <div className="w-12 h-1 bg-ajo-600 rounded-full mb-4"></div>
              <div className="text-ink-secondary font-medium">Total Saved</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-black text-ink mb-2 tracking-tight">
                99.9%
              </div>
              <div className="w-12 h-1 bg-ajo-600 rounded-full mb-4"></div>
              <div className="text-ink-secondary font-medium">Payout Rate</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-black text-ink mb-2 tracking-tight">
                100%
              </div>
              <div className="w-12 h-1 bg-ajo-600 rounded-full mb-4"></div>
              <div className="text-ink-secondary font-medium">Secure</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-sm font-bold tracking-widest text-ajo-600 uppercase mb-3">
              Community
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight">
              Loved by Nigerians
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
            {
              quote:
              'I never thought saving could be this easy. Greener Pastures helped me save ₦150,000 in just 3 months!',
              name: 'Adaeze O.',
              role: 'Teacher',
              location: 'Lagos',
              img: '1'
            },
            {
              quote:
              'The daily tracking keeps me accountable. Best financial decision I made this year.',
              name: 'Chinedu E.',
              role: 'Software Developer',
              location: 'Abuja',
              img: '2'
            },
            {
              quote:
              'I love the marketplace feature. I sold my old phone and added the money to my savings!',
              name: 'Ngozi K.',
              role: 'Entrepreneur',
              location: 'Port Harcourt',
              img: '3'
            }].
            map((t, i) =>
            <Card
              key={i}
              className="animated-border p-8 rounded-3xl border-none shadow-sm flex flex-col overflow-visible bg-white">
              
                <div className="flex items-center gap-1 text-amber-400 mb-6">
                  <StarIcon className="w-5 h-5 fill-current" />
                  <StarIcon className="w-5 h-5 fill-current" />
                  <StarIcon className="w-5 h-5 fill-current" />
                  <StarIcon className="w-5 h-5 fill-current" />
                  <StarIcon className="w-5 h-5 fill-current" />
                </div>
                <p className="text-lg text-ink-secondary italic mb-8 flex-1 leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <Avatar
                  initials={t.name.charAt(0)}
                  src={`https://i.pravatar.cc/100?img=${t.img}`}
                  size="md" />
                
                  <div>
                    <p className="font-bold text-ink">{t.name}</p>
                    <p className="text-sm text-ink-muted">
                      {t.role}, {t.location}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Expanded Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-ajo-600 rounded-xl flex items-center justify-center shadow-sm">
                  <SproutIcon className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl text-ink">
                  Greener Pastures
                </span>
              </div>
              <p className="text-ink-secondary leading-relaxed">
                Building wealth, one day at a time. The modern digital Ajo
                platform for Nigerians.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-ink mb-6">Product</h4>
              <ul className="space-y-4 text-ink-secondary">
                <li>
                  <a href="#" className="hover:text-ajo-600 transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ajo-600 transition-colors">
                    Savings Plans
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ajo-600 transition-colors">
                    Marketplace
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ajo-600 transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-ink mb-6">Company</h4>
              <ul className="space-y-4 text-ink-secondary">
                <li>
                  <a href="#" className="hover:text-ajo-600 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ajo-600 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ajo-600 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ajo-600 transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-ink mb-6">Legal</h4>
              <ul className="space-y-4 text-ink-secondary">
                <li>
                  <a href="#" className="hover:text-ajo-600 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ajo-600 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ajo-600 transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-ink-muted text-sm">
              © 2026 Greener Pastures Inc. All rights reserved.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>);

}