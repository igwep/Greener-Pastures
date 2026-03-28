import { motion } from 'framer-motion';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Card } from '../components/ui/Card';

export function DisclaimerPage() {
  return (
    <PublicLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 pb-16 md:pt-16 pt-8 px-4 max-w-4xl mx-auto"
      >
        <section className="text-center">
          <p className="text-sm font-bold tracking-widest text-secondary-700 uppercase mb-3">
            Disclaimer
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight mb-6">
            Important Information
          </h1>
          <p className="text-lg text-ink-secondary leading-relaxed">
            Please read this disclaimer carefully before using our platform
          </p>
        </section>

        <Card className="p-10 rounded-3xl border border-gray-100 shadow-sm bg-white">
          <div className="prose prose-lg max-w-none text-ink-secondary leading-relaxed space-y-6">
            <p>
              We are here to support and guide you in creating better financial and business opportunities through our services. While we are committed to delivering value and helping you grow, results may differ for each individual based on personal choices and other factors.
            </p>
            
            <p>
              We encourage you to make informed decisions and feel free to reach out to us anytime for support or clarification—we're always ready to help.
            </p>
            
            <p>
              By using our platform, you understand that your decisions are yours, and we remain dedicated to walking with you on your journey toward growth and success.
            </p>
          </div>
        </Card>

        <section className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:support@greenerpastures.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-secondary text-ink hover:bg-secondary-600 transition-colors shadow-sm"
            >
              Contact Support
            </a>
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium border border-gray-200 text-ink hover:bg-gray-50 transition-colors"
            >
              Learn More About Us
            </a>
          </div>
        </section>
      </motion.div>
    </PublicLayout>
  );
}
