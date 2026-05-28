import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Navbar from 'src/components/Navbar';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CompIntel — Compensation Intelligence Platform',
  description: 'Track, normalize, and visualize tech salaries based on real leveling mappings. Find total compensation (base salary, equity, and bonuses) across leading firms.',
  keywords: 'levels fyi clone, software engineering salaries, base salary, equity, stock grants, tech compensation, levels mapping',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
        {/* Navigation bar */}
        <Navbar />

        {/* Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900/60 bg-slate-950/20 py-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} CompIntel. Real Leveling. Structured Data. Open Sourced.</p>
            <p className="mt-1 text-slate-650">A premium, highly secure compensation intelligence experiment built with Next.js, Prisma and TailwindCSS.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
