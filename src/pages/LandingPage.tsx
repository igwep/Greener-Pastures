import React, { Children } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
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
    <PublicLayout>
      {/* Hero Section */}
      <section className="md:pt-16 pt-6 pb-32 px-4 overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[800px] h-[600px] bg-gradient-to-b from-secondary-50 to-transparent rounded-full blur-3xl -z-10 opacity-70"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-2xl">
            
            <Badge
              variant="success"
              className="mb-8 px-4 py-1.5 text-sm rounded-full bg-secondary-100 text-ink border border-secondary-200">
              
              Trusted by 500+ savers
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold text-ink leading-[1.1] mb-6 tracking-tight">
              Your money,
              <br />
              <span className="text-secondary-700 relative">
                growing daily.
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-secondary-200 -z-10"
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
              <a href="/marketplace">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-6 h-14 group">
                  
                  Or visit Our MarketPlace
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
            <div className="mt-12 flex items-center gap-4 text-sm text-ink-secondary font-medium">
              <div className="flex -space-x-3">
                <Avatar
                  initials="AO"
                  src="https://i.pinimg.com/736x/d8/2d/7c/d82d7c02807abb32089d0850aef432e6.jpg"
                  size="md"
                  className="border-2 border-surface" />
                
                <Avatar
                  initials="CO"
                  src="https://img.freepik.com/free-photo/african-american-man-wearing-round-glasses_273609-10062.jpg?semt=ais_incoming&w=740&q=80"
                  size="md"
                  className="border-2 border-surface" />
                
                <Avatar
                  initials="EK"
                  src="https://img.freepik.com/free-photo/close-up-smiley-man-with-glasses_23-2149009406.jpg"
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
            className="relative lg:ml-auto w-full max-w-md mx-auto lg:mx-0">
            
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
              className="absolute -left-4 sm:-left-8 top-12 z-20 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center gap-3">
              
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
              className="absolute -right-4 sm:-right-6 bottom-24 z-20 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
              
              <p className="text-xs text-ink-muted font-medium mb-1">
                Total Saved
              </p>
              <p className="text-xl font-bold text-secondary-700">₦18,000</p>
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-tr from-secondary-200 to-secondary-50 rounded-[2.5rem] transform rotate-3 scale-105 -z-10"></div>
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
                  className="bg-secondary-100 text-ink border border-secondary-200">
                  
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
                      className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${isPaid ? 'bg-secondary-500 text-white shadow-sm' : isPending ? 'bg-white text-amber-600 border-2 border-amber-400 shadow-sm ring-4 ring-amber-50' : 'bg-surface text-ink-muted border border-gray-100'}`}>
                      
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
            <p className="text-sm font-bold tracking-widest text-secondary-700 uppercase mb-3">
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
              
                <div className="absolute -top-6 -right-4 text-[80px] sm:text-[100px] md:text-[120px] font-black text-gray-50/80 leading-none select-none -z-10">
                  {step.num}
                </div>
                <div className="w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center mb-8 text-secondary-700 border border-secondary-100 shadow-sm">
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

      <section className="py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-sm font-bold tracking-widest text-secondary-700 uppercase mb-3">
                Marketplace
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight">
                Discover deals. List your products. Sell faster.
              </h2>
              <p className="text-xl text-ink-secondary leading-relaxed mb-8">
                Explore items posted by the community. When you’re ready to sell, sign in to create a listing, upload photos, choose a category, and manage your products from your dashboard.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-secondary-50 flex items-center justify-center text-secondary-700 shrink-0">
                    <CheckCircleIcon className="w-4 h-4" />
                  </div>
                  <p className="text-ink-secondary font-medium">
                    Filter by categories and find what you need quickly.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-secondary-50 flex items-center justify-center text-secondary-700 shrink-0">
                    <CheckCircleIcon className="w-4 h-4" />
                  </div>
                  <p className="text-ink-secondary font-medium">
                    Add multiple images to show your product clearly.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-secondary-50 flex items-center justify-center text-secondary-700 shrink-0">
                    <CheckCircleIcon className="w-4 h-4" />
                  </div>
                  <p className="text-ink-secondary font-medium">
                    Share contact details so buyers can reach you instantly.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/marketplace" className="sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto rounded-xl h-14 px-8">
                    Browse Marketplace
                  </Button>
                </Link>
                <Link to="/login" className="sm:w-auto">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto rounded-xl h-14 px-8 border-gray-200">
                    Sign in to List a Product
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary-200 to-secondary-50 rounded-[2.5rem] transform -rotate-2 scale-105 -z-10"></div>
              <Card className="border border-gray-100 shadow-2xl rounded-[2rem] p-10 bg-white/95 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-ink">Marketplace Highlights</h3>
                    <p className="text-sm text-ink-muted">A quick look at what’s trending</p>
                  </div>
                  <Badge className="bg-secondary-100 text-ink border border-secondary-200">Live</Badge>
                </div>
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-surface border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-ink">Electronics</p>
                      <p className="text-sm text-ink-muted">Phones, laptops, gadgets</p>
                    </div>
                    <span className="text-sm font-bold text-secondary-700">Popular</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-ink">Home & Garden</p>
                      <p className="text-sm text-ink-muted">Furniture, decor, essentials</p>
                    </div>
                    <span className="text-sm font-bold text-secondary-700">New</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-ink">Services</p>
                      <p className="text-sm text-ink-muted">Skilled work and labor</p>
                    </div>
                    <span className="text-sm font-bold text-secondary-700">Hot</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators - Lighter approach */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="text-5xl font-black text-ink mb-2 tracking-tight">
                500+
              </div>
              <div className="w-12 h-1 bg-ajo-600 rounded-full mb-4"></div>
              <div className="text-ink-secondary font-medium">
                Active Savers
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-black text-ink mb-2 tracking-tight">
                ₦20M+
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
              location: 'Victoria Island, Lagos',
              img: '1'
            },
            {
              quote:
              'The daily tracking keeps me accountable. Best financial decision I made this year.',
              name: 'Chinedu E.',
              role: 'Software Developer',
              location: 'Yaba, Lagos',
              img: '2'
            },
            {
              quote:
              'I love the marketplace feature. I sold my old phone and added the money to my savings!',
              name: 'Ngozi K.',
              role: 'Entrepreneur',
              location: 'Yaba, Lagos',
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
                  {/* <Avatar
                  initials={t.name.charAt(0)}
                  src={`https://i.pravatar.cc/100?img=${t.img}`}
                  size="md" /> */}
                
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
    </PublicLayout>
  );
}