'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, ArrowLeft, DollarSign, Building, Briefcase, MapPin, 
  Award, Sparkles, CheckCircle, ArrowRight, ShieldCheck, RefreshCw 
} from 'lucide-react';
import Link from 'next/link';

interface ValidationError {
  field: string;
  message: string;
}

export default function SubmitSalary() {
  const router = useRouter();

  // Form Fields State
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('');
  const [location, setLocation] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [stockGrant, setStockGrant] = useState('');
  const [bonus, setBonus] = useState('');

  // UI Flow States
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  // Derived Real-Time Calculations
  const baseNum = Math.max(0, Number(baseSalary) || 0);
  const stockNum = Math.max(0, Number(stockGrant) || 0);
  const bonusNum = Math.max(0, Number(bonus) || 0);
  const annualizedStock = Math.round(stockNum / 4);
  const liveTotalComp = baseNum + annualizedStock + bonusNum;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${apiUrl}/api/salaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          title,
          level,
          location,
          baseSalary: baseNum,
          stockGrant: stockNum,
          bonus: bonusNum,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors([{ field: 'global', message: data.error || 'Failed to submit.' }]);
        }
      } else {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrors([{ field: 'global', message: 'Network error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(err => err.field === field)?.message;
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="glass-panel rounded-3xl p-10 border border-emerald-500/20 shadow-2xl space-y-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 glow-emerald animate-bounce">
            <CheckCircle className="w-9 h-9" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Datapoint Ingested Successfully</h2>
          <p className="text-slate-450 text-sm max-w-md leading-relaxed">
            Your salary submission was validated, standardized, and integrated into our intelligence engine database.
          </p>

          {/* Submitted Summary Info Card */}
          <div className="w-full bg-slate-950/50 border border-slate-900 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Company & Role:</span>
              <span className="text-slate-300 font-extrabold">{company} ({title})</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Standardized Level Mapped:</span>
              <span className="text-emerald-400 font-bold">{level}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-slate-900 pt-2.5">
              <span className="text-slate-500 font-medium">Computed Annual Total Pay:</span>
              <span className="text-emerald-400 font-black text-sm">${liveTotalComp.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full pt-4">
            <Link
              href="/"
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-800/60 hover:text-white transition text-center"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                setCompany('');
                setTitle('');
                setLevel('');
                setLocation('');
                setBaseSalary('');
                setStockGrant('');
                setBonus('');
                setErrors([]);
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 text-sm font-black hover:from-emerald-400 hover:to-emerald-500 shadow-lg glow-emerald transition cursor-pointer"
            >
              Add Another Record
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header breadcrumb */}
      <div className="flex items-center">
        <Link 
          href="/" 
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-350 uppercase tracking-wider transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column: Entry Form */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight">
              Contribute <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Salary Data</span>
            </h1>
            <p className="text-slate-450 text-sm leading-relaxed">
              Help build transparent software engineering, PM, and design salaries. All submissions are encrypted and completely anonymous.
            </p>
          </div>

          {getFieldError('global') && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>{getFieldError('global')}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-5">
            {/* Sec 1: Professional Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-850 pb-2">
                Professional Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-slate-400">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Google, Meta"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className={`w-full bg-slate-950/45 border ${getFieldError('company') ? 'border-rose-500/60' : 'border-slate-800'} rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60`}
                    />
                  </div>
                  {getFieldError('company') && (
                    <span className="text-[10px] text-rose-450 font-semibold">{getFieldError('company')}</span>
                  )}
                </div>

                {/* Job Title */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-slate-400">Job Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Software Engineer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full bg-slate-950/45 border ${getFieldError('title') ? 'border-rose-500/60' : 'border-slate-800'} rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60`}
                    />
                  </div>
                  {getFieldError('title') && (
                    <span className="text-[10px] text-rose-450 font-semibold">{getFieldError('title')}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Raw Level */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-slate-400">Company Level</label>
                  <div className="relative">
                    <Award className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. L4, E5, Senior"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className={`w-full bg-slate-950/45 border ${getFieldError('level') ? 'border-rose-500/60' : 'border-slate-800'} rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60`}
                    />
                  </div>
                  {getFieldError('level') && (
                    <span className="text-[10px] text-rose-450 font-semibold">{getFieldError('level')}</span>
                  )}
                </div>

                {/* Location */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-slate-400">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. San Francisco, CA"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={`w-full bg-slate-950/45 border ${getFieldError('location') ? 'border-rose-500/60' : 'border-slate-800'} rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60`}
                    />
                  </div>
                  {getFieldError('location') && (
                    <span className="text-[10px] text-rose-450 font-semibold">{getFieldError('location')}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Sec 2: Compensation Breakdown */}
            <div className="space-y-4 pt-3">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-850 pb-2">
                Annual Compensation Breakdown (USD)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Base Salary */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-slate-400">Base Salary</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                    <input
                      type="number"
                      required
                      placeholder="Annual Base"
                      value={baseSalary}
                      onChange={(e) => setBaseSalary(e.target.value)}
                      className={`w-full bg-slate-950/45 border ${getFieldError('baseSalary') ? 'border-rose-500/60' : 'border-slate-800'} rounded-xl pl-8 pr-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-indigo-500/60`}
                    />
                  </div>
                  {getFieldError('baseSalary') && (
                    <span className="text-[10px] text-rose-450 font-semibold">{getFieldError('baseSalary')}</span>
                  )}
                </div>

                {/* Stock Grant */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-slate-400">Total Stock Grant (4-Yr)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                    <input
                      type="number"
                      placeholder="4-Year RSU Value"
                      value={stockGrant}
                      onChange={(e) => setStockGrant(e.target.value)}
                      className={`w-full bg-slate-950/45 border ${getFieldError('stockGrant') ? 'border-rose-500/60' : 'border-slate-800'} rounded-xl pl-8 pr-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-indigo-500/60`}
                    />
                  </div>
                  {getFieldError('stockGrant') && (
                    <span className="text-[10px] text-rose-450 font-semibold">{getFieldError('stockGrant')}</span>
                  )}
                </div>

                {/* Annual Bonus */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-slate-400">Annual Bonus</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                    <input
                      type="number"
                      placeholder="Yearly Bonus"
                      value={bonus}
                      onChange={(e) => setBonus(e.target.value)}
                      className={`w-full bg-slate-950/45 border ${getFieldError('bonus') ? 'border-rose-500/60' : 'border-slate-800'} rounded-xl pl-8 pr-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-indigo-500/60`}
                    />
                  </div>
                  {getFieldError('bonus') && (
                    <span className="text-[10px] text-rose-450 font-semibold">{getFieldError('bonus')}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Form Submit Button */}
            <div className="pt-4 border-t border-slate-850">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black text-sm hover:from-emerald-400 hover:to-emerald-500 shadow-lg glow-emerald active:scale-98 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                    <span>Processing Submission...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Normalize</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right column: Interactive Live TC Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel border-b border-indigo-500/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-[300px] shadow-xl">
            {/* Visual glow element */}
            <div className="absolute -right-16 -top-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
            <div className="absolute -left-16 -bottom-16 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-glow"></div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                <span>Live Calculator</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-400">Annualized Total Compensation</h3>
            </div>

            <div className="relative z-10 text-center py-6">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Calculated Salary (Yearly)</span>
              <div className="text-4xl sm:text-5xl font-black text-emerald-450 tracking-tight mt-1 animate-pulse-slow">
                ${liveTotalComp.toLocaleString()}
              </div>
            </div>

            {/* In-Depth Breakdown values */}
            <div className="relative z-10 grid grid-cols-3 gap-2 border-t border-slate-850 pt-4 text-center text-xs">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Base Pay</span>
                <p className="font-extrabold text-slate-350 text-sm mt-0.5">${baseNum.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Stock / Yr</span>
                <p className="font-extrabold text-indigo-400 text-sm mt-0.5">${annualizedStock.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Bonus</span>
                <p className="font-extrabold text-violet-400 text-sm mt-0.5">${bonusNum.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Extra Info Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-850 space-y-3.5 text-xs leading-relaxed text-slate-450">
            <div className="flex items-center space-x-2 text-slate-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-450" />
              <span>Data Normalization & Protection Rules</span>
            </div>
            <p>
              Our system runs ingestion scripts on every submit:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1.5">
              <li>Company names standardizing (e.g. <code className="text-slate-300">google inc</code> $\rightarrow$ <code className="text-slate-300">Google</code>).</li>
              <li>Stocks are divided by <code className="text-slate-300">4</code> to match standard annual vesting templates.</li>
              <li>Missing stock/bonus fields are safely initialized to <code className="text-slate-300">$0</code>.</li>
              <li>Verification rules automatically block invalid spam inputs.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
