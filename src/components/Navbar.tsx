'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LineChart, BarChart2, PlusCircle, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: BarChart2 },
    { name: 'Compare Levels', path: '/compare', icon: LineChart },
    { name: 'Submit Salary', path: '/submit', icon: PlusCircle }
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center glow-emerald shadow-lg group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-extrabold text-sm tracking-wider">CI</span>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-slate-100 via-slate-200 to-indigo-200 bg-clip-text text-transparent tracking-tight">
                Comp<span className="text-emerald-400 font-semibold group-hover:text-emerald-300 transition-colors">Intel</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-800/80 text-emerald-400 border border-slate-700/50 glow-emerald'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Call to Action Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/submit"
              className="inline-flex items-center space-x-1.5 px-4.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-emerald-500 shadow-md glow-emerald active:scale-95 transition-all duration-200"
            >
              <span>Contribute Data</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 focus:outline-none transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-850 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800/80 text-emerald-400 border border-slate-700/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-800/60 mt-3">
            <Link
              href="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold text-base hover:from-emerald-400 hover:to-emerald-500 glow-emerald"
            >
              <span>Contribute Data</span>
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
