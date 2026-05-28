'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Search, Briefcase, MapPin, Award, DollarSign, ArrowUpDown, 
  TrendingUp, Users, ShieldAlert, Sparkles, Filter, RotateCcw
} from 'lucide-react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  standardizedName: string;
  sector: string;
  logoUrl: string;
}

interface SalaryRecord {
  id: string;
  companyId: string;
  company: Company;
  title: string;
  level: string;
  standardLevelTier: string;
  location: string;
  baseSalary: number;
  stockGrant: number;
  bonus: number;
  totalCompensation: number;
  createdAt: string;
}

interface AnalyticsData {
  byTier: Array<{
    tier: string;
    displayName: string;
    medianTC: number;
    medianBase: number;
    medianStock: number;
    medianBonus: number;
    count: number;
  }>;
  byCompany: Array<{
    company: string;
    medianTC: number;
    medianBase: number;
    medianStock: number;
    medianBonus: number;
    count: number;
  }>;
  byLocation: Array<{
    location: string;
    medianTC: number;
    count: number;
  }>;
  stats: {
    avgTC: number;
    count: number;
    topCompany: string;
  };
}

export default function Dashboard() {
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  
  // Filtering & Sorting State
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [selectedLoc, setSelectedLoc] = useState('');
  const [sortBy, setSortBy] = useState('totalCompensation');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Lists for dropdown options
  const [companies, setCompanies] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  // Refetch when filters or sorts change
  useEffect(() => {
    if (mounted) {
      fetchSalaries();
    }
  }, [search, selectedCompany, selectedTier, selectedLoc, sortBy, sortOrder]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchSalaries(), fetchAnalytics()]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalaries = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCompany) params.append('company', selectedCompany);
      if (selectedTier) params.append('tier', selectedTier);
      if (selectedLoc) params.append('location', selectedLoc);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await fetch(`/api/salaries?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSalaries(data);

        // Derive list of unique companies and locations for dropdowns on initial fetch
        if (!selectedCompany && !selectedLoc && !search && !selectedTier) {
          const uniqueComps = Array.from(new Set(data.map((s: SalaryRecord) => s.company.name))) as string[];
          const uniqueLocs = Array.from(new Set(data.map((s: SalaryRecord) => s.location))) as string[];
          setCompanies(uniqueComps.sort());
          setLocations(uniqueLocs.sort());
        }
      }
    } catch (error) {
      console.error('Failed to fetch salaries:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCompany('');
    setSelectedTier('');
    setSelectedLoc('');
    setSortBy('totalCompensation');
    setSortOrder('desc');
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(0)}k`;
    }
    return `$${val.toLocaleString()}`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'JUNIOR': return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25';
      case 'MID': return 'bg-sky-500/10 text-sky-400 border border-sky-500/25';
      case 'SENIOR': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 glow-emerald';
      case 'STAFF': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25';
      case 'PRINCIPAL': return 'bg-violet-500/10 text-violet-400 border border-violet-500/25 glow-indigo';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-550/25';
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative text-center sm:text-left py-6 sm:py-8">
        <div className="flex items-center justify-center sm:justify-start space-x-2 text-emerald-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Real-time Levels-first Compensation Data</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Demystifying <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Tech Compensation</span>
        </h1>
        <p className="max-w-3xl text-base sm:text-lg text-slate-400 leading-relaxed">
          Standardized leveling maps let you compare software engineering, data science, and product roles apples-to-apples. Search verified salaries and discover real base, stock, and bonus ratios.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1 */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Total Pay</span>
            <div className="text-3xl font-black text-emerald-400">
              {analytics ? formatCurrency(analytics.stats.avgTC) : '$0'}
            </div>
            <div className="flex items-center text-xs text-slate-450 space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Annualized average</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Datapoints</span>
            <div className="text-3xl font-black text-indigo-450">
              {analytics ? analytics.stats.count : 0}
            </div>
            <div className="flex items-center text-xs text-slate-450 space-x-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-450" />
              <span>Submissions vetted</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-450 border border-indigo-500/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Highest Median Comp</span>
            <div className="text-xl sm:text-2xl font-black text-violet-400 leading-tight">
              {analytics ? analytics.stats.topCompany.split(' ')[0] : 'N/A'}
            </div>
            <div className="flex items-center text-xs text-slate-450 space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>{analytics ? analytics.stats.topCompany.substring(analytics.stats.topCompany.indexOf('(')) : 'Top paying standard'}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Block */}
      {mounted && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Stacked Bar Chart */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col h-[400px]">
            <h3 className="text-sm font-bold text-slate-350 mb-1 flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-emerald-450" />
              <span>Median Compensation Components by Level Tier</span>
            </h3>
            <span className="text-xs text-slate-500 mb-6">Standardized cross-company leveling (Stock annualized over 4 years)</span>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.byTier}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                  <XAxis dataKey="displayName" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickFormatter={(val) => `$${val / 1000}k`}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                    formatter={(value: any) => [formatCurrency(value as number), '']}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                  <Bar name="Base Salary" dataKey="medianBase" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                  <Bar name="Stock Grant (Vested/Yr)" dataKey="medianStock" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                  <Bar name="Annual Bonus" dataKey="medianBonus" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Area Curve of Top Companies */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col h-[400px]">
            <h3 className="text-sm font-bold text-slate-350 mb-1 flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Compensation Leaderboard (Median TC)</span>
            </h3>
            <span className="text-xs text-slate-500 mb-6">Median Total Compensation comparing standard tech employers</span>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics.byCompany}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                  <XAxis dataKey="company" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickFormatter={(val) => `$${val / 1000}k`}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                    formatter={(value: any) => [formatCurrency(value as number), 'Median TC']}
                  />
                  <Area type="monotone" dataKey="medianTC" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTC)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Main Database Table Area */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>Verified Salary Datapoints</span>
            <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full font-semibold border border-slate-700">
              {salaries.length} records found
            </span>
          </h2>

          <Link
            href="/submit"
            className="sm:hidden w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold text-sm"
          >
            Submit Salary +
          </Link>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          {/* Row 1: Search & Reset */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by company, title, location, or level..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950/45 border border-slate-800/80 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition"
              />
            </div>
            
            {(selectedCompany || selectedTier || selectedLoc || search) && (
              <button
                onClick={resetFilters}
                className="w-full md:w-auto flex items-center justify-center space-x-1.5 px-4.5 py-3 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 text-sm font-semibold hover:text-slate-200 hover:bg-slate-800/40 transition active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Row 2: Select Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Filter by Company */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <Briefcase className="w-3 h-3" />
                <span>Company</span>
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full bg-slate-950/45 border border-slate-800/80 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/60 transition cursor-pointer"
              >
                <option value="">All Companies</option>
                {companies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Filter by Level Tier */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <Award className="w-3 h-3" />
                <span>Standard Level</span>
              </label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full bg-slate-950/45 border border-slate-800/80 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/60 transition cursor-pointer"
              >
                <option value="">All Tiers</option>
                <option value="JUNIOR">Junior (L3 / E3)</option>
                <option value="MID">Mid-Level (L4 / E4)</option>
                <option value="SENIOR">Senior (L5 / E5)</option>
                <option value="STAFF">Staff (L6 / E6)</option>
                <option value="PRINCIPAL">Principal (L7+)</option>
              </select>
            </div>

            {/* Filter by Location */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>Location</span>
              </label>
              <select
                value={selectedLoc}
                onChange={(e) => setSelectedLoc(e.target.value)}
                className="w-full bg-slate-950/45 border border-slate-800/80 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/60 transition cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Salaries Table */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-4.5 px-6">Company / Role</th>
                  <th className="py-4.5 px-6">
                    <button 
                      onClick={() => toggleSort('level')}
                      className="flex items-center space-x-1 hover:text-slate-200 transition"
                    >
                      <span>Level</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-4.5 px-6">Location</th>
                  <th className="py-4.5 px-6 hidden sm:table-cell">
                    <button 
                      onClick={() => toggleSort('baseSalary')}
                      className="flex items-center space-x-1 hover:text-slate-200 transition"
                    >
                      <span>Base Salary</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-4.5 px-6 hidden md:table-cell">Stock / Yr</th>
                  <th className="py-4.5 px-6 hidden md:table-cell">Bonus</th>
                  <th className="py-4.5 px-6">
                    <button 
                      onClick={() => toggleSort('totalCompensation')}
                      className="flex items-center space-x-1 text-slate-200 hover:text-white transition"
                    >
                      <span>Total Comp</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-emerald-450" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-5 px-6">
                        <div className="h-4 bg-slate-800 rounded w-36 mb-2"></div>
                        <div className="h-3 bg-slate-800 rounded w-24"></div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="h-5 bg-slate-800 rounded-full w-20"></div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="h-4 bg-slate-800 rounded w-28"></div>
                      </td>
                      <td className="py-5 px-6 hidden sm:table-cell">
                        <div className="h-4 bg-slate-800 rounded w-16"></div>
                      </td>
                      <td className="py-5 px-6 hidden md:table-cell">
                        <div className="h-4 bg-slate-800 rounded w-16"></div>
                      </td>
                      <td className="py-5 px-6 hidden md:table-cell">
                        <div className="h-4 bg-slate-800 rounded w-12"></div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="h-4 bg-slate-800 rounded w-20"></div>
                      </td>
                    </tr>
                  ))
                ) : salaries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 px-6 text-center text-slate-500">
                      <ShieldAlert className="w-10 h-10 mx-auto text-slate-650 mb-3" />
                      <p className="text-sm font-semibold text-slate-400">No compensation records match your filters.</p>
                      <button 
                        onClick={resetFilters}
                        className="mt-3 text-xs font-bold text-indigo-400 hover:underline cursor-pointer"
                      >
                        Reset search queries
                      </button>
                    </td>
                  </tr>
                ) : (
                  salaries.map((s) => (
                    <tr 
                      key={s.id} 
                      className="hover:bg-slate-900/25 transition-colors group text-sm"
                    >
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-slate-100 group-hover:text-emerald-300 transition-colors flex items-center space-x-1.5">
                          <span>{s.company.name}</span>
                        </div>
                        <div className="text-xs text-slate-450 font-medium mt-0.5">{s.title}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-300">{s.level}</div>
                        <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full mt-1.5 ${getTierColor(s.standardLevelTier)}`}>
                          {s.standardLevelTier}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-350">
                        <div className="flex items-center space-x-1 text-slate-300 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{s.location}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-300 hidden sm:table-cell">
                        {formatCurrency(s.baseSalary)}
                      </td>
                      <td className="py-4 px-6 text-slate-400 hidden md:table-cell">
                        {s.stockGrant > 0 ? formatCurrency(s.stockGrant / 4) : '—'}
                      </td>
                      <td className="py-4 px-6 text-slate-400 hidden md:table-cell">
                        {s.bonus > 0 ? formatCurrency(s.bonus) : '—'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-black text-base text-emerald-450 tracking-tight">
                          {formatCurrency(s.totalCompensation)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
