import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'src/lib/db';

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[half];
  }
  return Math.round((sorted[half - 1] + sorted[half]) / 2);
}

export async function GET(request: NextRequest) {
  try {
    // Fetch all verified salary records with company details
    const salaries = await prisma.salaryRecord.findMany({
      where: { status: 'VERIFIED' },
      include: { company: true }
    });

    if (salaries.length === 0) {
      return NextResponse.json({
        byTier: [],
        byCompany: [],
        byLocation: [],
        stats: { avgTC: 0, count: 0, topCompany: 'N/A' }
      });
    }

    // 1. Calculate General Statistics
    const allTC = salaries.map(s => s.totalCompensation);
    const avgTC = Math.round(allTC.reduce((sum, val) => sum + val, 0) / salaries.length);
    const totalCount = salaries.length;

    // Company payouts aggregator to find the top paying company
    const companyTotals: { [name: string]: number[] } = {};
    salaries.forEach(s => {
      if (!companyTotals[s.company.name]) companyTotals[s.company.name] = [];
      companyTotals[s.company.name].push(s.totalCompensation);
    });

    let topCompany = 'N/A';
    let maxMedianPay = 0;
    Object.entries(companyTotals).forEach(([name, pays]) => {
      const med = calculateMedian(pays);
      if (med > maxMedianPay) {
        maxMedianPay = med;
        topCompany = name;
      }
    });

    // 2. Aggregate by Standard Level Tier
    const tiers = ['JUNIOR', 'MID', 'SENIOR', 'STAFF', 'PRINCIPAL'];
    const byTier = tiers.map(tier => {
      const filtered = salaries.filter(s => s.standardLevelTier === tier);
      const tcs = filtered.map(s => s.totalCompensation);
      const bases = filtered.map(s => s.baseSalary);
      const stocks = filtered.map(s => s.stockGrant / 4); // Annualized stock
      const bonuses = filtered.map(s => s.bonus);

      return {
        tier,
        displayName: tier.charAt(0) + tier.slice(1).toLowerCase(),
        medianTC: calculateMedian(tcs),
        medianBase: calculateMedian(bases),
        medianStock: calculateMedian(stocks),
        medianBonus: calculateMedian(bonuses),
        count: filtered.length
      };
    });

    // 3. Aggregate by Company (Top 6 by count)
    const activeCompanies = Array.from(new Set(salaries.map(s => s.company.name)));
    const companyData = activeCompanies.map(compName => {
      const filtered = salaries.filter(s => s.company.name === compName);
      const tcs = filtered.map(s => s.totalCompensation);
      const bases = filtered.map(s => s.baseSalary);
      const stocks = filtered.map(s => s.stockGrant / 4);
      const bonuses = filtered.map(s => s.bonus);

      return {
        company: compName,
        medianTC: calculateMedian(tcs),
        medianBase: calculateMedian(bases),
        medianStock: calculateMedian(stocks),
        medianBonus: calculateMedian(bonuses),
        count: filtered.length
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 6); // Take top 6 most active companies for charting

    // 4. Aggregate by Location (Top 5 locations)
    const locations = Array.from(new Set(salaries.map(s => s.location)));
    const byLocation = locations.map(loc => {
      const filtered = salaries.filter(s => s.location === loc);
      const tcs = filtered.map(s => s.totalCompensation);

      return {
        location: loc,
        medianTC: calculateMedian(tcs),
        count: filtered.length
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

    return NextResponse.json({
      byTier,
      byCompany: companyData,
      byLocation,
      stats: {
        avgTC,
        count: totalCount,
        topCompany: `${topCompany} ($${Math.round(maxMedianPay / 1000)}k median)`
      }
    });
  } catch (error: any) {
    console.error('GET /api/analytics error:', error);
    return NextResponse.json({ error: 'Failed to compute analytics' }, { status: 500 });
  }
}
