import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-surface font-sans selection:bg-ajo-200 selection:text-ajo-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src="/logo.jpeg" 
                alt="Greener Pastures" 
                className="w-10 h-10 rounded-xl object-cover shadow-sm"
              />
              <span className="hidden md:block font-bold text-2xl tracking-tight text-ink bg-gradient-to-r from-ink to-secondary-700 bg-clip-text text-transparent">
                Greener Pastures
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-secondary">
            <a
              href="#how-it-works"
              className="hover:text-ajo-600 transition-colors">
              How it Works
            </a>
            <Link
              to="/about"
              className="hover:text-ajo-600 transition-colors">
              About
            </Link>
            <Link
              to="/marketplace"
              className="hover:text-ajo-600 transition-colors">
              Marketplace
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-ink hover:text-ajo-600 transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link to="/register">
              <button className="bg-ajo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-ajo-700 transition-colors shadow-sm">
                Start Growing
              </button>
            </Link>
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <XIcon className="w-5 h-5 text-ink" />
              ) : (
                <MenuIcon className="w-5 h-5 text-ink" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                duration: 0.15, 
                ease: 'easeOut',
                type: 'tween'
              }}
              className="md:hidden border-t border-gray-100 bg-white overflow-hidden will-change-transform"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-2">
                <a
                  href="#how-it-works"
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-ink-secondary hover:bg-gray-50 hover:text-ajo-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How it Works
                </a>
                <Link
                  to="/about"
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-ink-secondary hover:bg-gray-50 hover:text-ajo-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/marketplace"
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-ink-secondary hover:bg-gray-50 hover:text-ajo-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Marketplace
                </Link>

                <div className="h-px bg-gray-100 my-2" />

                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-ink-secondary hover:bg-gray-50 hover:text-ajo-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <img 
                    src="/logo.jpeg" 
                    alt="Greener Pastures" 
                    className="w-10 h-10 rounded-xl object-cover shadow-sm"
                  />
                  <span className="font-bold text-xl text-ink">
                    Greener Pastures
                  </span>
                  <span className="text-xs text-ink-muted ml-2">Investment International Limited</span>
                </Link>
              </div>
              <p className="text-ink-secondary leading-relaxed">
                Building wealth, one day at a time. The modern digital Ajo
                platform for Nigerians.
              </p>
              <p className="text-xs text-ink-muted mt-2 italic">
                Building opportunities, securing futures.
              </p>
           {/*    <p className="text-xs text-ink-muted mt-2">
                Greener Pastures Investment International Limited
              </p> */}
            </div>

            <div>
              <h4 className="font-bold text-ink mb-6">Product</h4>
              <ul className="space-y-4 text-ink-secondary">
                <li>
                  <a href="#how-it-works" className="hover:text-ajo-600 transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <Link
                    to="/marketplace"
                    className="hover:text-ajo-600 transition-colors">
                    Marketplace
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-ink mb-6">Company</h4>
              <ul className="space-y-4 text-ink-secondary">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-ajo-600 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/disclaimer"
                    className="hover:text-ajo-600 transition-colors">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-ink mb-6">Contact</h4>
              <div className="space-y-3 text-ink-secondary">
                <p>
                  <a href="mailto:support@greenerpastures.com" className="hover:text-ajo-600 transition-colors">
                    greenerpasturesinvestment1@gmail.com
                  </a>
                </p>
                <p>
                  <a href="tel:+2348000000000" className="hover:text-ajo-600 transition-colors">
                   07062174820
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-ink-muted text-sm">
              © 2026 Greener Pastures Investment International Limited. All rights reserved.
            </p>
            {/* <div className="flex gap-4">
             
              <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"></div>
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
