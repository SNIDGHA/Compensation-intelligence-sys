'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, ShieldCheck, Scale, Sparkles, 
  Briefcase, TrendingUp, AlertCircle, Award, Check 
} from 'lucide-react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
}

interface SalaryRecord {
  id: string;
  company: Company;
  standardLevelTier: string;
  level: string;
  baseSalary: number;
  stockGrant: number;
  bonus: number;
  totalCompensation: number;
}

interface CompanyStats {
  company: string;
  rawLevel: string;
  medianTC: number;
  medianBase: number;
  medianStock: number;
  medianBonus: number;
  count: number;
}

export default function CompareLevels() {
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Selector States
  const [companyA, setCompanyA] = useState('Google');
  const [companyB, setCompanyB] = useState('Meta');
  const [uniqueCompanies, setUniqueCompanies] = useState<string[]>([]);

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${apiUrl}/api/salaries`);
      if (res.ok) {
        const data = await res.json();
        setSalaries(data);

        // Extract unique companies
        const companies = Array.from(new Set(data.map((s: SalaryRecord) => s.company.name))) as string[];
        setUniqueCompanies(companies.sort());
      }
    } catch (error) {
      console.error('Failed to fetch salaries for comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMedian = (values: number[]): number => {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const half = Math.floor(sorted.length / 2);
    if (sorted.length % 2 !== 0) {
      return sorted[half];
    }
    return Math.round((sorted[half - 1] + sorted[half]) / 2);
  };

  // Compute medians for a company at a given standardized tier
  const getCompanyStatsForTier = (compName: string, tier: string): CompanyStats | null => {
    const filtered = salaries.filter(
      s => s.company.name.toLowerCase() === compName.toLowerCase() && s.standardLevelTier === tier
    );

    if (filtered.length === 0) return null;

    const tcs = filtered.map(s => s.totalCompensation);
    const bases = filtered.map(s => s.baseSalary);
    const stocks = filtered.map(s => s.stockGrant / 4); // Annualized stock
    const bonuses = filtered.map(s => s.bonus);

    // Extract most common raw company level name submitted
    const levelCounts: { [l: string]: number } = {};
    filtered.forEach(s => {
      levelCounts[s.level] = (levelCounts[s.level] || 0) + 1;
    });
    const rawLevel = Object.entries(levelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

    return {
      company: compName,
      rawLevel,
      medianTC: calculateMedian(tcs),
      medianBase: calculateMedian(bases),
      medianStock: calculateMedian(stocks),
      medianBonus: calculateMedian(bonuses),
      count: filtered.length
    };
  };

  const formatCurrency = (val: number) => {
    if (val === 0) return '—';
    return `$${(val / 1000).toFixed(0)}k`;
  };

  const tiers = [
    { key: 'JUNIOR', name: 'Junior (L3 / E3 / 59)', rank: 1 },
    { key: 'MID', name: 'Mid-Level (L4 / E4 / 61)', rank: 2 },
    { key: 'SENIOR', name: 'Senior (L5 / E5 / 63)', rank: 3 },
    { key: 'STAFF', name: 'Staff (L6 / E6 / 65)', rank: 4 },
    { key: 'PRINCIPAL', name: 'Principal (L7+ / E7+ / 67)', rank: 5 }
  ];

  return (
    <div className="space-y-8">
      {/* Header and Back Link */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link 
          href="/" 
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-350 uppercase tracking-wider transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs sm:text-sm font-semibold tracking-wider uppercase">
          <Scale className="w-4 h-4" />
          <span>Side-by-Side Compensation Intelligence</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Compare <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">Company Levels</span>
        </h1>
        <p className="max-w-3xl text-slate-450 text-sm leading-relaxed">
          Standardized level tiers enable a clean, apples-to-apples comparison of base pay, equity vest ratios, and bonuses across two different firms.
        </p>
      </div>

      {/* Selectors Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12">
          {/* Company A */}
          <div className="flex-1 w-full flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>Company A</span>
            </label>
            <select
              value={companyA}
              onChange={(e) => setCompanyA(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-base text-slate-200 focus:outline-none focus:border-indigo-500/60 transition cursor-pointer"
            >
              {uniqueCompanies.map(c => (
                <option key={c} value={c} disabled={c === companyB}>{c}</option>
              ))}
            </select>
          </div>

          {/* vs Badge */}
          <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-450 font-black text-xs glow-emerald shadow-lg shrink-0">
            VS
          </div>

          {/* Company B */}
          <div className="flex-1 w-full flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
              <Briefcase className="w-3.5 h-3.5 text-emerald-450" />
              <span>Company B</span>
            </label>
            <select
              value={companyB}
              onChange={(e) => setCompanyB(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-base text-slate-200 focus:outline-none focus:border-indigo-500/60 transition cursor-pointer"
            >
              {uniqueCompanies.map(c => (
                <option key={c} value={c} disabled={c === companyA}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Grid Table */}
      {loading ? (
        <div className="py-12 text-center text-slate-500">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Calculating medians and mapping levels...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold text-slate-450 uppercase tracking-wider">
                    <th className="py-4 px-6 w-1/4">Standardized Tier</th>
                    <th className="py-4 px-6 text-center bg-indigo-500/5 text-indigo-400 w-1/3 border-r border-slate-850">
                      {companyA} Level Details
                    </th>
                    <th className="py-4 px-6 text-center bg-emerald-500/5 text-emerald-400 w-1/3">
                      {companyB} Level Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60">
                  {tiers.map((t) => {
                    const statsA = getCompanyStatsForTier(companyA, t.key);
                    const statsB = getCompanyStatsForTier(companyB, t.key);

                    // Determine which company pays more at this level
                    const hasDataA = statsA !== null;
                    const hasDataB = statsB !== null;
                    const isMorePayA = hasDataA && (!hasDataB || statsA!.medianTC > statsB!.medianTC);
                    const isMorePayB = hasDataB && (!hasDataA || statsB!.medianTC > statsA!.medianTC);

                    return (
                      <tr key={t.key} className="hover:bg-slate-900/15 transition">
                        {/* Standardized Tier Name */}
                        <td className="py-5 px-6">
                          <div className="font-extrabold text-slate-200 text-sm flex items-center space-x-1.5">
                            <Award className="w-4 h-4 text-slate-500" />
                            <span>{t.name.split(' ')[0]}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">
                            {t.name.substring(t.name.indexOf('('))}
                          </span>
                        </td>

                        {/* Company A Stats */}
                        <td className={`py-5 px-6 border-r border-slate-850 ${isMorePayA ? 'bg-indigo-500/[0.015]' : ''}`}>
                          {statsA ? (
                            <div className="space-y-3">
                              {/* Header: Level & Total Comp */}
                              <div className="flex items-center justify-between">
                                <span className="bg-slate-800 text-indigo-300 border border-slate-700 px-2 py-0.5 rounded text-xs font-black">
                                  {statsA.rawLevel}
                                </span>
                                <div className="flex items-center space-x-1.5">
                                  <span className={`text-base font-black tracking-tight ${isMorePayA ? 'text-emerald-400' : 'text-slate-300'}`}>
                                    {formatCurrency(statsA.medianTC)}
                                  </span>
                                  {isMorePayA && (
                                    <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-black uppercase flex items-center space-x-0.5">
                                      <Check className="w-2.5 h-2.5" />
                                      <span>More</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Base, Stock, Bonus breakdown list */}
                              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] text-slate-450 bg-slate-950/30 rounded-lg p-2 border border-slate-900">
                                <div>
                                  <span className="text-[8px] font-bold uppercase text-slate-550 block">Base</span>
                                  <span className="font-extrabold text-slate-350">{formatCurrency(statsA.medianBase)}</span>
                                </div>
                                <div>
                                  <span className="text-[8px] font-bold uppercase text-slate-550 block">Stock/Yr</span>
                                  <span className="font-extrabold text-indigo-400">{formatCurrency(statsA.medianStock)}</span>
                                </div>
                                <div>
                                  <span className="text-[8px] font-bold uppercase text-slate-550 block">Bonus</span>
                                  <span className="font-extrabold text-violet-400">{formatCurrency(statsA.medianBonus)}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-xs text-slate-550 flex items-center justify-center space-x-1">
                              <AlertCircle className="w-4 h-4 text-slate-650" />
                              <span>No verified data available</span>
                            </div>
                          )}
                        </td>

                        {/* Company B Stats */}
                        <td className={`py-5 px-6 ${isMorePayB ? 'bg-emerald-500/[0.015]' : ''}`}>
                          {statsB ? (
                            <div className="space-y-3">
                              {/* Header: Level & Total Comp */}
                              <div className="flex items-center justify-between">
                                <span className="bg-slate-800 text-emerald-300 border border-slate-700 px-2 py-0.5 rounded text-xs font-black">
                                  {statsB.rawLevel}
                                </span>
                                <div className="flex items-center space-x-1.5">
                                  <span className={`text-base font-black tracking-tight ${isMorePayB ? 'text-emerald-400' : 'text-slate-300'}`}>
                                    {formatCurrency(statsB.medianTC)}
                                  </span>
                                  {isMorePayB && (
                                    <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-black uppercase flex items-center space-x-0.5">
                                      <Check className="w-2.5 h-2.5" />
                                      <span>More</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Base, Stock, Bonus breakdown list */}
                              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] text-slate-450 bg-slate-950/30 rounded-lg p-2 border border-slate-900">
                                <div>
                                  <span className="text-[8px] font-bold uppercase text-slate-550 block">Base</span>
                                  <span className="font-extrabold text-slate-350">{formatCurrency(statsB.medianBase)}</span>
                                </div>
                                <div>
                                  <span className="text-[8px] font-bold uppercase text-slate-550 block">Stock/Yr</span>
                                  <span className="font-extrabold text-indigo-400">{formatCurrency(statsB.medianStock)}</span>
                                </div>
                                <div>
                                  <span className="text-[8px] font-bold uppercase text-slate-550 block">Bonus</span>
                                  <span className="font-extrabold text-violet-400">{formatCurrency(statsB.medianBonus)}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-xs text-slate-550 flex items-center justify-center space-x-1">
                              <AlertCircle className="w-4 h-4 text-slate-650" />
                              <span>No verified data available</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Analysis Summary footer */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-850 flex items-start space-x-3.5 text-xs text-slate-450 leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-300 block">CompIntel Levels Mapping Methodology</span>
              <p>
                Our comparing engine dynamically extracts all salary records for selected companies, groups them by standard international leveling definitions (Junior, Mid-Level, Senior, Staff, Principal), and calculates the true mathematical **median** rather than standard arithmetic means. RSU/Stock grants are annualized assuming a standard 4-year linear vest format (Stock / 4).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
