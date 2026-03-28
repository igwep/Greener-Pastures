import { motion } from 'framer-motion';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Card } from '../components/ui/Card';
import {
  TargetIcon,
  EyeIcon,
  BriefcaseIcon,
  HeartHandshakeIcon,
  ShieldCheckIcon,
  LightbulbIcon,
  TrendingUpIcon,
  BadgeCheckIcon,
} from 'lucide-react';

export function AboutPage() {
  return (
    <PublicLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-16 pb-16 md:pt-16 pt-8 px-4 max-w-7xl mx-auto"
      >
        <section className="text-center max-w-4xl mx-auto">
          <p className="text-sm font-bold tracking-widest text-secondary-700 uppercase mb-3">
            About Greener Pastures
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-ink tracking-tight mb-6">
            Building sustainable wealth opportunities
          </h1>
          <p className="text-lg md:text-xl text-ink-secondary leading-relaxed">
            We empower individuals and businesses through innovative financial solutions and diverse service offerings—designed to help you save, grow, access support, and thrive.
          </p>
        </section>

        <section className="grid lg:grid-cols-3 gap-8">
          <Card className="p-10 rounded-3xl border border-gray-100 shadow-sm bg-white">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-50 border border-secondary-100 flex items-center justify-center text-secondary-700 shrink-0">
                <TargetIcon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-ink">Mission</h2>
            </div>
            <p className="text-ink-secondary leading-relaxed">
              To empower individuals and businesses by creating sustainable wealth opportunities through innovative financial solutions, micro-saving systems, investment, loans and diverse service offerings including technology, logistics, marketplace and more. We are committed to delivering value, trust, and customer satisfaction in every interaction.
            </p>
          </Card>

          <Card className="p-10 rounded-3xl border border-gray-100 shadow-sm bg-white">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-50 border border-secondary-100 flex items-center justify-center text-secondary-700 shrink-0">
                <EyeIcon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-ink">Vision</h2>
            </div>
            <p className="text-ink-secondary leading-relaxed">
              To become a leading and trusted platform recognized globally for transforming lives and businesses through accessible financial services, digital innovation, and a wide range of impactful business solutions.
            </p>
          </Card>

          <Card className="p-10 rounded-3xl border border-gray-100 shadow-sm bg-white">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-50 border border-secondary-100 flex items-center justify-center text-secondary-700 shrink-0">
                <BriefcaseIcon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-ink">What we do</h2>
            </div>
            <div className="space-y-3 text-ink-secondary leading-relaxed">
              <p>Micro-savings and wealth-building tools</p>
              <p>Investment and growth opportunities</p>
              <p>Loans that support progress</p>
              <p>Marketplace for community commerce</p>
              <p>Technology and logistics solutions</p>
            </div>
          </Card>
        </section>

        <section>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-bold tracking-widest text-secondary-700 uppercase mb-3">
              Core Values
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight">
              Principles that guide every decision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 rounded-3xl border border-gray-100 shadow-sm bg-white">
              <div className="flex items-start gap-4 mb-2">
                <div className="w-11 h-11 rounded-2xl bg-secondary-50 border border-secondary-100 flex items-center justify-center text-secondary-700 shrink-0">
                  <HeartHandshakeIcon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-ink">Customer First</h3>
              </div>
              <p className="text-ink-secondary leading-relaxed">
                We prioritize satisfaction and long-term relationships.
              </p>
            </Card>

            <Card className="p-8 rounded-3xl border border-gray-100 shadow-sm bg-white">
              <div className="flex items-start gap-4 mb-2">
                <div className="w-11 h-11 rounded-2xl bg-secondary-50 border border-secondary-100 flex items-center justify-center text-secondary-700 shrink-0">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-ink">Integrity</h3>
              </div>
              <p className="text-ink-secondary leading-relaxed">
                We operate with honesty and transparency.
              </p>
            </Card>

            <Card className="p-8 rounded-3xl border border-gray-100 shadow-sm bg-white">
              <div className="flex items-start gap-4 mb-2">
                <div className="w-11 h-11 rounded-2xl bg-secondary-50 border border-secondary-100 flex items-center justify-center text-secondary-700 shrink-0">
                  <LightbulbIcon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-ink">Innovation</h3>
              </div>
              <p className="text-ink-secondary leading-relaxed">
                We embrace new ideas and technology.
              </p>
            </Card>

            <Card className="p-8 rounded-3xl border border-gray-100 shadow-sm bg-white">
              <div className="flex items-start gap-4 mb-2">
                <div className="w-11 h-11 rounded-2xl bg-secondary-50 border border-secondary-100 flex items-center justify-center text-secondary-700 shrink-0">
                  <TrendingUpIcon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-ink">Growth</h3>
              </div>
              <p className="text-ink-secondary leading-relaxed">
                We are committed to continuous improvement and wealth creation.
              </p>
            </Card>

            <Card className="p-8 rounded-3xl border border-gray-100 shadow-sm bg-white md:col-span-2">
              <div className="flex items-start gap-4 mb-2">
                <div className="w-11 h-11 rounded-2xl bg-secondary-50 border border-secondary-100 flex items-center justify-center text-secondary-700 shrink-0">
                  <BadgeCheckIcon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-ink">Reliability</h3>
              </div>
              <p className="text-ink-secondary leading-relaxed">
                We deliver on our promises.
              </p>
            </Card>
          </div>
        </section>
      </motion.div>
    </PublicLayout>
  );
}
