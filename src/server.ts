import express from 'express';
import cors from 'cors';
import { prisma } from './lib/db';
import { validateSalarySubmission } from './lib/validation';
import { normalizeCompanyName, calculateTotalCompensation, mapLevelToStandardTier } from './lib/normalization';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: '*', // Allow all origins for simplicity in this demo build
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Root health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Helper for median calculations
function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[half];
  }
  return Math.round((sorted[half - 1] + sorted[half]) / 2);
}

// 1. GET Salaries endpoint
app.get('/api/salaries', async (req, res) => {
  try {
    const search = (req.query.search as string) || '';
    const company = (req.query.company as string) || '';
    const location = (req.query.location as string) || '';
    const tier = (req.query.tier as string) || '';
    const sortBy = (req.query.sortBy as string) || 'totalCompensation';
    const sortOrder = (req.query.sortOrder as string) === 'asc' ? 'asc' : 'desc';

    const allowedSortFields = ['totalCompensation', 'baseSalary', 'createdAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'totalCompensation';

    const where: any = {
      status: 'VERIFIED'
    };

    if (company) {
      where.company = {
        name: { equals: company }
      };
    }

    if (location) {
      where.location = {
        contains: location
      };
    }

    if (tier) {
      where.standardLevelTier = {
        equals: tier
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { level: { contains: search } },
        { location: { contains: search } },
        { company: { name: { contains: search } } }
      ];
    }

    const salaries = await prisma.salaryRecord.findMany({
      where,
      include: {
        company: true
      },
      orderBy: {
        [sortField]: sortOrder
      }
    });

    res.json(salaries);
  } catch (error: any) {
    console.error('GET /api/salaries error:', error);
    res.status(500).json({ error: 'Failed to fetch salaries' });
  }
});

// 2. POST Salaries Ingestion endpoint
app.post('/api/salaries', async (req, res) => {
  try {
    const { isValid, errors, validatedData } = validateSalarySubmission(req.body);
    if (!isValid || !validatedData) {
      return res.status(400).json({ errors });
    }

    const normCompany = normalizeCompanyName(validatedData.company);
    const totalComp = calculateTotalCompensation(
      validatedData.baseSalary,
      validatedData.stockGrant || 0,
      validatedData.bonus || 0
    );
    const levelMapInfo = mapLevelToStandardTier(normCompany, validatedData.level);

    let companyRecord = await prisma.company.findUnique({
      where: { name: normCompany }
    });

    if (!companyRecord) {
      companyRecord = await prisma.company.create({
        data: {
          name: normCompany,
          standardizedName: normCompany,
          sector: 'Technology'
        }
      });
    }

    const salaryRecord = await prisma.salaryRecord.create({
      data: {
        companyId: companyRecord.id,
        title: validatedData.title,
        level: validatedData.level,
        standardLevelTier: levelMapInfo.tier,
        location: validatedData.location,
        baseSalary: validatedData.baseSalary,
        stockGrant: validatedData.stockGrant || 0,
        bonus: validatedData.bonus || 0,
        totalCompensation: totalComp,
        status: 'VERIFIED'
      },
      include: {
        company: true
      }
    });

    res.status(201).json(salaryRecord);
  } catch (error: any) {
    console.error('POST /api/salaries error:', error);
    res.status(500).json({ error: 'Failed to submit salary record' });
  }
});

// 3. GET Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const salaries = await prisma.salaryRecord.findMany({
      where: { status: 'VERIFIED' },
      include: { company: true }
    });

    if (salaries.length === 0) {
      return res.json({
        byTier: [],
        byCompany: [],
        byLocation: [],
        stats: { avgTC: 0, count: 0, topCompany: 'N/A' }
      });
    }

    const allTC = salaries.map(s => s.totalCompensation);
    const avgTC = Math.round(allTC.reduce((sum, val) => sum + val, 0) / salaries.length);
    const totalCount = salaries.length;

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

    const tiers = ['JUNIOR', 'MID', 'SENIOR', 'STAFF', 'PRINCIPAL'];
    const byTier = tiers.map(tier => {
      const filtered = salaries.filter(s => s.standardLevelTier === tier);
      const tcs = filtered.map(s => s.totalCompensation);
      const bases = filtered.map(s => s.baseSalary);
      const stocks = filtered.map(s => s.stockGrant / 4);
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
    .slice(0, 6);

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

    res.json({
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
    res.status(500).json({ error: 'Failed to compute analytics' });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
