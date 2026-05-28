import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'src/lib/db';

type SalaryRecordType = {
  totalCompensation: number;
  baseSalary: number;
  stockGrant: number;
  bonus: number;
  standardLevelTier: string;
  location: string;
  company: {
    name: string;
  };
};

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
    const salaries: SalaryRecordType[] = await prisma.salaryRecord.findMany({
      where: { status: 'VERIFIED' },
      include: { company: true }
    });

    if (salaries.length === 0) {
      return NextResponse.json({
        byTier: [],
        byCompany: [],
        byLocation: [],
        stats: {
          avgTC: 0,
          count: 0,
          topCompany: 'N/A'
        }
      });
    }

    // 1. Calculate General Statistics
    const allTC = salaries.map((s: SalaryRecordType) => s.totalCompensation);

    const avgTC = Math.round(
      allTC.reduce((sum: number, val: number) => sum + val, 0) /
      salaries.length
    );

    const totalCount = salaries.length;

    // Company payouts aggregator
    const companyTotals: { [name: string]: number[] } = {};

    salaries.forEach((s: SalaryRecordType) => {
      if (!companyTotals[s.company.name]) {
        companyTotals[s.company.name] = [];
      }

      companyTotals[s.company.name].push(s.totalCompensation);
    });

    let topCompany = 'N/A';
    let maxMedianPay = 0;

    Object.entries(companyTotals).forEach(
      ([name, pays]: [string, number[]]) => {
        const med = calculateMedian(pays);

        if (med > maxMedianPay) {
          maxMedianPay = med;
          topCompany = name;
        }
      }
    );

    // 2. Aggregate by Tier
    const tiers = ['JUNIOR', 'MID', 'SENIOR', 'STAFF', 'PRINCIPAL'];

    const byTier = tiers.map((tier: string) => {
      const filtered = salaries.filter(
        (s: SalaryRecordType) => s.standardLevelTier === tier
      );

      const tcs = filtered.map(
        (s: SalaryRecordType) => s.totalCompensation
      );

      const bases = filtered.map(
        (s: SalaryRecordType) => s.baseSalary
      );

      const stocks = filtered.map(
        (s: SalaryRecordType) => s.stockGrant / 4
      );

      const bonuses = filtered.map(
        (s: SalaryRecordType) => s.bonus
      );

      return {
        tier,
        displayName:
          tier.charAt(0) + tier.slice(1).toLowerCase(),
        medianTC: calculateMedian(tcs),
        medianBase: calculateMedian(bases),
        medianStock: calculateMedian(stocks),
        medianBonus: calculateMedian(bonuses),
        count: filtered.length
      };
    });

    // 3. Aggregate by Company
    const activeCompanies = Array.from(
      new Set(
        salaries.map((s: SalaryRecordType) => s.company.name)
      )
    );

    const companyData = activeCompanies
      .map((compName: string) => {
        const filtered = salaries.filter(
          (s: SalaryRecordType) => s.company.name === compName
        );

        const tcs = filtered.map(
          (s: SalaryRecordType) => s.totalCompensation
        );

        const bases = filtered.map(
          (s: SalaryRecordType) => s.baseSalary
        );

        const stocks = filtered.map(
          (s: SalaryRecordType) => s.stockGrant / 4
        );

        const bonuses = filtered.map(
          (s: SalaryRecordType) => s.bonus
        );

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
      .slice(0, 6);

    // 4. Aggregate by Location
    const locations = Array.from(
      new Set(
        salaries.map((s: SalaryRecordType) => s.location)
      )
    );

    const byLocation = locations
      .map((loc: string) => {
        const filtered = salaries.filter(
          (s: SalaryRecordType) => s.location === loc
        );

        const tcs = filtered.map(
          (s: SalaryRecordType) => s.totalCompensation
        );

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
        topCompany: `${topCompany} ($${Math.round(
          maxMedianPay / 1000
        )}k median)`
      }
    });
  } catch (error: any) {
    console.error('GET /api/analytics error:', error);

    return NextResponse.json(
      { error: 'Failed to compute analytics' },
      { status: 500 }
    );
  }
}