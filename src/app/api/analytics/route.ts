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
    const salaries: any = await prisma.salaryRecord.findMany({
      where: {
        status: 'VERIFIED'
      },
      include: {
        company: true
      }
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

    const allTC = salaries.map((s: any) => s.totalCompensation);

    const avgTC = Math.round(
      allTC.reduce((sum: any, val: any) => sum + val, 0) /
      salaries.length
    );

    const totalCount = salaries.length;

    const companyTotals: any = {};

    salaries.forEach((s: any) => {
      if (!companyTotals[s.company.name]) {
        companyTotals[s.company.name] = [];
      }

      companyTotals[s.company.name].push(s.totalCompensation);
    });

    let topCompany = 'N/A';
    let maxMedianPay = 0;

    Object.entries(companyTotals).forEach(
      ([name, pays]: any) => {
        const med = calculateMedian(pays);

        if (med > maxMedianPay) {
          maxMedianPay = med;
          topCompany = name;
        }
      }
    );

    const tiers = [
      'JUNIOR',
      'MID',
      'SENIOR',
      'STAFF',
      'PRINCIPAL'
    ];

    const byTier = tiers.map((tier: any) => {
      const filtered = salaries.filter(
        (s: any) => s.standardLevelTier === tier
      );

      return {
        tier,

        displayName:
          tier.charAt(0) + tier.slice(1).toLowerCase(),

        medianTC: calculateMedian(
          filtered.map((s: any) => s.totalCompensation)
        ),

        medianBase: calculateMedian(
          filtered.map((s: any) => s.baseSalary)
        ),

        medianStock: calculateMedian(
          filtered.map((s: any) => s.stockGrant / 4)
        ),

        medianBonus: calculateMedian(
          filtered.map((s: any) => s.bonus)
        ),

        count: filtered.length
      };
    });

    const activeCompanies = Array.from(
      new Set(
        salaries.map((s: any) => s.company.name)
      )
    );

    const companyData = activeCompanies
      .map((compName: any) => {
        const filtered = salaries.filter(
          (s: any) => s.company.name === compName
        );

        return {
          company: compName,

          medianTC: calculateMedian(
            filtered.map((s: any) => s.totalCompensation)
          ),

          medianBase: calculateMedian(
            filtered.map((s: any) => s.baseSalary)
          ),

          medianStock: calculateMedian(
            filtered.map((s: any) => s.stockGrant / 4)
          ),

          medianBonus: calculateMedian(
            filtered.map((s: any) => s.bonus)
          ),

          count: filtered.length
        };
      })
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 6);

    const locations = Array.from(
      new Set(
        salaries.map((s: any) => s.location)
      )
    );

    const byLocation = locations
      .map((loc: any) => {
        const filtered = salaries.filter(
          (s: any) => s.location === loc
        );

        return {
          location: loc,

          medianTC: calculateMedian(
            filtered.map((s: any) => s.totalCompensation)
          ),

          count: filtered.length
        };
      })
      .sort((a: any, b: any) => b.count - a.count)
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
      {
        error: 'Failed to compute analytics'
      },
      {
        status: 500
      }
    );
  }
}