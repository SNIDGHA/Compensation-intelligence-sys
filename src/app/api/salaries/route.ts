import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'src/lib/db';
import { validateSalarySubmission } from 'src/lib/validation';
import { normalizeCompanyName, calculateTotalCompensation, mapLevelToStandardTier } from 'src/lib/normalization';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const company = searchParams.get('company') || '';
    const location = searchParams.get('location') || '';
    const tier = searchParams.get('tier') || '';
    const sortBy = searchParams.get('sortBy') || 'totalCompensation';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Verify sort field is valid
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
      // In SQLite contains is case-insensitive by default in many contexts, but we support searching multiple fields
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

    return NextResponse.json(salaries);
  } catch (error: any) {
    console.error('GET /api/salaries error:', error);
    return NextResponse.json({ error: 'Failed to fetch salaries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 1. Validate submission input
    const { isValid, errors, validatedData } = validateSalarySubmission(body);
    if (!isValid || !validatedData) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // 2. Normalization
    const normCompany = normalizeCompanyName(validatedData.company);
    const totalComp = calculateTotalCompensation(
      validatedData.baseSalary,
      validatedData.stockGrant || 0,
      validatedData.bonus || 0
    );
    const levelMapInfo = mapLevelToStandardTier(normCompany, validatedData.level);

    // 3. Find or create company
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

    // 4. Create Salary Record
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

    return NextResponse.json(salaryRecord, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/salaries error:', error);
    return NextResponse.json({ error: 'Failed to submit salary record' }, { status: 500 });
  }
}
