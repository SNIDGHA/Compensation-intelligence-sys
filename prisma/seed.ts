import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const companies = [
  { name: 'Google', standardizedName: 'Google', sector: 'Software & Cloud', logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=80&h=80' },
  { name: 'Meta', standardizedName: 'Meta', sector: 'Social Media & VR', logoUrl: 'https://images.unsplash.com/photo-1634088630796-3796c96d0137?auto=format&fit=crop&w=80&h=80' },
  { name: 'Microsoft', standardizedName: 'Microsoft', sector: 'Software & Enterprise', logoUrl: 'https://images.unsplash.com/photo-1625014618427-fbc9f6f32c88?auto=format&fit=crop&w=80&h=80' },
  { name: 'Apple', standardizedName: 'Apple', sector: 'Consumer Electronics', logoUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=80&h=80' },
  { name: 'Amazon', standardizedName: 'Amazon', sector: 'E-commerce & Cloud', logoUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=80&h=80' },
  { name: 'Netflix', standardizedName: 'Netflix', sector: 'Streaming Media', logoUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8edd86?auto=format&fit=crop&w=80&h=80' },
  { name: 'Stripe', standardizedName: 'Stripe', sector: 'Fintech & Payments', logoUrl: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=80&h=80' },
  { name: 'Uber', standardizedName: 'Uber', sector: 'Ride-Hailing & Logistics', logoUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=80&h=80' },
  { name: 'Nvidia', standardizedName: 'Nvidia', sector: 'Hardware & AI Chips', logoUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=80&h=80' }
];

const levelMappings = [
  // Google
  { companyName: 'Google', companyLevel: 'L3', standardLevelTier: 'JUNIOR', levelRank: 1 },
  { companyName: 'Google', companyLevel: 'L4', standardLevelTier: 'MID', levelRank: 2 },
  { companyName: 'Google', companyLevel: 'L5', standardLevelTier: 'SENIOR', levelRank: 3 },
  { companyName: 'Google', companyLevel: 'L6', standardLevelTier: 'STAFF', levelRank: 4 },
  { companyName: 'Google', companyLevel: 'L7', standardLevelTier: 'PRINCIPAL', levelRank: 5 },
  
  // Meta
  { companyName: 'Meta', companyLevel: 'E3', standardLevelTier: 'JUNIOR', levelRank: 1 },
  { companyName: 'Meta', companyLevel: 'E4', standardLevelTier: 'MID', levelRank: 2 },
  { companyName: 'Meta', companyLevel: 'E5', standardLevelTier: 'SENIOR', levelRank: 3 },
  { companyName: 'Meta', companyLevel: 'E6', standardLevelTier: 'STAFF', levelRank: 4 },
  { companyName: 'Meta', companyLevel: 'E7', standardLevelTier: 'PRINCIPAL', levelRank: 5 },
  
  // Microsoft
  { companyName: 'Microsoft', companyLevel: '59', standardLevelTier: 'JUNIOR', levelRank: 1 },
  { companyName: 'Microsoft', companyLevel: '61', standardLevelTier: 'MID', levelRank: 2 },
  { companyName: 'Microsoft', companyLevel: '63', standardLevelTier: 'SENIOR', levelRank: 3 },
  { companyName: 'Microsoft', companyLevel: '65', standardLevelTier: 'STAFF', levelRank: 4 },
  { companyName: 'Microsoft', companyLevel: '67', standardLevelTier: 'PRINCIPAL', levelRank: 5 },

  // Apple
  { companyName: 'Apple', companyLevel: 'ICT2', standardLevelTier: 'JUNIOR', levelRank: 1 },
  { companyName: 'Apple', companyLevel: 'ICT3', standardLevelTier: 'MID', levelRank: 2 },
  { companyName: 'Apple', companyLevel: 'ICT4', standardLevelTier: 'SENIOR', levelRank: 3 },
  { companyName: 'Apple', companyLevel: 'ICT5', standardLevelTier: 'STAFF', levelRank: 4 },
  { companyName: 'Apple', companyLevel: 'ICT6', standardLevelTier: 'PRINCIPAL', levelRank: 5 },

  // Amazon
  { companyName: 'Amazon', companyLevel: 'L4', standardLevelTier: 'JUNIOR', levelRank: 1 },
  { companyName: 'Amazon', companyLevel: 'L5', standardLevelTier: 'MID', levelRank: 2 },
  { companyName: 'Amazon', companyLevel: 'L6', standardLevelTier: 'SENIOR', levelRank: 3 },
  { companyName: 'Amazon', companyLevel: 'L7', standardLevelTier: 'STAFF', levelRank: 4 },
  { companyName: 'Amazon', companyLevel: 'L8', standardLevelTier: 'PRINCIPAL', levelRank: 5 }
];

const mockSalaries = [
  // Google Salaries
  { companyName: 'Google', title: 'Software Engineer', level: 'L3', tier: 'JUNIOR', location: 'San Francisco, CA', base: 142000, stock: 120000, bonus: 18000 },
  { companyName: 'Google', title: 'Software Engineer', level: 'L3', tier: 'JUNIOR', location: 'New York, NY', base: 139000, stock: 110000, bonus: 15000 },
  { companyName: 'Google', title: 'Software Engineer', level: 'L4', tier: 'MID', location: 'San Francisco, CA', base: 168000, stock: 210000, bonus: 26000 },
  { companyName: 'Google', title: 'Software Engineer', level: 'L4', tier: 'MID', location: 'Seattle, WA', base: 162000, stock: 190000, bonus: 24000 },
  { companyName: 'Google', title: 'Software Engineer', level: 'L4', tier: 'MID', location: 'Bangalore, India', base: 45000, stock: 40000, bonus: 6000 }, // in USD equiv roughly
  { companyName: 'Google', title: 'Software Engineer', level: 'L5', tier: 'SENIOR', location: 'San Francisco, CA', base: 205000, stock: 480000, bonus: 41000 },
  { companyName: 'Google', title: 'Software Engineer', level: 'L5', tier: 'SENIOR', location: 'New York, NY', base: 198000, stock: 450000, bonus: 38000 },
  { companyName: 'Google', title: 'Product Manager', level: 'L5', tier: 'SENIOR', location: 'San Francisco, CA', base: 215000, stock: 360000, bonus: 45000 },
  { companyName: 'Google', title: 'Software Engineer', level: 'L6', tier: 'STAFF', location: 'Mountain View, CA', base: 255000, stock: 920000, bonus: 65000 },
  { companyName: 'Google', title: 'Software Engineer', level: 'L7', tier: 'PRINCIPAL', location: 'Mountain View, CA', base: 310000, stock: 1600000, bonus: 98000 },

  // Meta Salaries
  { companyName: 'Meta', title: 'Software Engineer', level: 'E3', tier: 'JUNIOR', location: 'Menlo Park, CA', base: 138000, stock: 150000, bonus: 14000 },
  { companyName: 'Meta', title: 'Software Engineer', level: 'E3', tier: 'JUNIOR', location: 'Seattle, WA', base: 135000, stock: 140000, bonus: 13000 },
  { companyName: 'Meta', title: 'Software Engineer', level: 'E4', tier: 'MID', location: 'Menlo Park, CA', base: 165000, stock: 260000, bonus: 24000 },
  { companyName: 'Meta', title: 'Software Engineer', level: 'E4', tier: 'MID', location: 'New York, NY', base: 168000, stock: 280000, bonus: 25000 },
  { companyName: 'Meta', title: 'Data Scientist', level: 'E4', tier: 'MID', location: 'Menlo Park, CA', base: 155000, stock: 190000, bonus: 20000 },
  { companyName: 'Meta', title: 'Software Engineer', level: 'E5', tier: 'SENIOR', location: 'Menlo Park, CA', base: 208000, stock: 580000, bonus: 42000 },
  { companyName: 'Meta', title: 'Software Engineer', level: 'E5', tier: 'SENIOR', location: 'Seattle, WA', base: 199000, stock: 520000, bonus: 38000 },
  { companyName: 'Meta', title: 'Product Manager', level: 'E5', tier: 'SENIOR', location: 'New York, NY', base: 212000, stock: 440000, bonus: 40000 },
  { companyName: 'Meta', title: 'Software Engineer', level: 'E6', tier: 'STAFF', location: 'Menlo Park, CA', base: 258000, stock: 1100000, bonus: 68000 },
  { companyName: 'Meta', title: 'Software Engineer', level: 'E7', tier: 'PRINCIPAL', location: 'Menlo Park, CA', base: 315000, stock: 2100000, bonus: 105000 },

  // Microsoft Salaries
  { companyName: 'Microsoft', title: 'Software Engineer', level: '59', tier: 'JUNIOR', location: 'Redmond, WA', base: 122000, stock: 60000, bonus: 12000 },
  { companyName: 'Microsoft', title: 'Software Engineer', level: '60', tier: 'JUNIOR', location: 'Redmond, WA', base: 131000, stock: 80000, bonus: 15000 },
  { companyName: 'Microsoft', title: 'Software Engineer', level: '61', tier: 'MID', location: 'Redmond, WA', base: 148000, stock: 120000, bonus: 18000 },
  { companyName: 'Microsoft', title: 'Software Engineer', level: '62', tier: 'MID', location: 'Redmond, WA', base: 156000, stock: 150000, bonus: 20000 },
  { companyName: 'Microsoft', title: 'Software Engineer', level: '62', tier: 'MID', location: 'Bangalore, India', base: 36000, stock: 32000, bonus: 4500 },
  { companyName: 'Microsoft', title: 'Software Engineer', level: '63', tier: 'SENIOR', location: 'Redmond, WA', base: 185000, stock: 240000, bonus: 32000 },
  { companyName: 'Microsoft', title: 'Product Manager', level: '63', tier: 'SENIOR', location: 'Redmond, WA', base: 190000, stock: 220000, bonus: 35000 },
  { companyName: 'Microsoft', title: 'Software Engineer', level: '65', tier: 'STAFF', location: 'Redmond, WA', base: 232000, stock: 520000, bonus: 50000 },
  { companyName: 'Microsoft', title: 'Software Engineer', level: '67', tier: 'PRINCIPAL', location: 'Redmond, WA', base: 285000, stock: 950000, bonus: 85000 },

  // Apple Salaries
  { companyName: 'Apple', title: 'Software Engineer', level: 'ICT2', tier: 'JUNIOR', location: 'Cupertino, CA', base: 136000, stock: 100000, bonus: 14000 },
  { companyName: 'Apple', title: 'Software Engineer', level: 'ICT3', tier: 'MID', location: 'Cupertino, CA', base: 161000, stock: 180000, bonus: 20000 },
  { companyName: 'Apple', title: 'Software Engineer', level: 'ICT4', tier: 'SENIOR', location: 'Cupertino, CA', base: 198000, stock: 380000, bonus: 35000 },
  { companyName: 'Apple', title: 'Software Engineer', level: 'ICT5', tier: 'STAFF', location: 'Cupertino, CA', base: 245000, stock: 780000, bonus: 58000 },
  { companyName: 'Apple', title: 'Software Engineer', level: 'ICT6', tier: 'PRINCIPAL', location: 'Cupertino, CA', base: 305000, stock: 1400000, bonus: 92000 },

  // Amazon Salaries
  { companyName: 'Amazon', title: 'Software Engineer', level: 'L4', tier: 'JUNIOR', location: 'Seattle, WA', base: 132000, stock: 110000, bonus: 18000 },
  { companyName: 'Amazon', title: 'Software Engineer', level: 'L4', tier: 'JUNIOR', location: 'Austin, TX', base: 128000, stock: 98000, bonus: 16000 },
  { companyName: 'Amazon', title: 'Software Engineer', level: 'L5', tier: 'MID', location: 'Seattle, WA', base: 154000, stock: 220000, bonus: 24000 },
  { companyName: 'Amazon', title: 'Software Engineer', level: 'L5', tier: 'MID', location: 'San Francisco, CA', base: 162000, stock: 250000, bonus: 26000 },
  { companyName: 'Amazon', title: 'Software Engineer', level: 'L6', tier: 'SENIOR', location: 'Seattle, WA', base: 186000, stock: 460000, bonus: 38000 },
  { companyName: 'Amazon', title: 'Product Manager', level: 'L6', tier: 'SENIOR', location: 'Seattle, WA', base: 178000, stock: 320000, bonus: 32000 },
  { companyName: 'Amazon', title: 'Software Engineer', level: 'L7', tier: 'STAFF', location: 'Seattle, WA', base: 225000, stock: 850000, bonus: 55000 },
  { companyName: 'Amazon', title: 'Software Engineer', level: 'L8', tier: 'PRINCIPAL', location: 'Seattle, WA', base: 295000, stock: 1550000, bonus: 90000 },

  // Stripe Salaries
  { companyName: 'Stripe', title: 'Software Engineer', level: 'L1', tier: 'JUNIOR', location: 'San Francisco, CA', base: 145000, stock: 140000, bonus: 15000 },
  { companyName: 'Stripe', title: 'Software Engineer', level: 'L2', tier: 'MID', location: 'San Francisco, CA', base: 172000, stock: 280000, bonus: 22000 },
  { companyName: 'Stripe', title: 'Software Engineer', level: 'L3', tier: 'SENIOR', location: 'San Francisco, CA', base: 212000, stock: 520000, bonus: 35000 },
  { companyName: 'Stripe', title: 'Software Engineer', level: 'L4', tier: 'STAFF', location: 'San Francisco, CA', base: 260000, stock: 950000, bonus: 55000 },

  // Netflix Salaries
  { companyName: 'Netflix', title: 'Software Engineer', level: 'Senior', tier: 'SENIOR', location: 'Los Gatos, CA', base: 450000, stock: 0, bonus: 0 },
  { companyName: 'Netflix', title: 'Software Engineer', level: 'Senior', tier: 'SENIOR', location: 'Los Gatos, CA', base: 380000, stock: 400000, bonus: 0 },
  { companyName: 'Netflix', title: 'Software Engineer', level: 'Staff', tier: 'STAFF', location: 'Los Gatos, CA', base: 550000, stock: 200000, bonus: 0 },

  // Nvidia Salaries
  { companyName: 'Nvidia', title: 'Software Engineer', level: 'IC3', tier: 'MID', location: 'Santa Clara, CA', base: 165000, stock: 240000, bonus: 25000 },
  { companyName: 'Nvidia', title: 'Software Engineer', level: 'IC4', tier: 'SENIOR', location: 'Santa Clara, CA', base: 198000, stock: 480000, bonus: 35000 },
  { companyName: 'Nvidia', title: 'Hardware Engineer', level: 'IC5', tier: 'STAFF', location: 'Santa Clara, CA', base: 245000, stock: 820000, bonus: 50000 }
];

// Let's multiply the data to get 100+ highly realistic variations
const generatedMockSalaries = [...mockSalaries];
const titles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'Solutions Architect', 'Hardware Engineer'];
const locations = ['San Francisco, CA', 'Seattle, WA', 'New York, NY', 'Austin, TX', 'Boston, MA', 'Bangalore, India', 'London, UK'];

for (let i = 0; i < 60; i++) {
  const baseSalaryEntry = mockSalaries[i % mockSalaries.length];
  const scale = 0.9 + Math.random() * 0.2; // +/- 10%
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomLoc = locations[Math.floor(Math.random() * locations.length)];
  
  // Adjust base/stock/bonus values dynamically for regional scaling
  let locationFactor = 1.0;
  if (randomLoc.includes('India')) locationFactor = 0.25;
  if (randomLoc.includes('UK')) locationFactor = 0.75;
  
  generatedMockSalaries.push({
    companyName: baseSalaryEntry.companyName,
    title: randomTitle,
    level: baseSalaryEntry.level,
    tier: baseSalaryEntry.tier,
    location: randomLoc,
    base: Math.round(baseSalaryEntry.base * scale * locationFactor),
    stock: Math.round(baseSalaryEntry.stock * scale * locationFactor),
    bonus: Math.round(baseSalaryEntry.bonus * scale * locationFactor)
  });
}

async function main() {
  console.log('Seeding Database...');

  // 1. Seed Companies
  const companyMap = new Map<string, string>();
  for (const c of companies) {
    const created = await prisma.company.upsert({
      where: { name: c.name },
      update: {},
      create: {
        name: c.name,
        standardizedName: c.standardizedName,
        sector: c.sector,
        logoUrl: c.logoUrl
      }
    });
    companyMap.set(c.name, created.id);
    console.log(`Created company: ${created.name}`);
  }

  // 2. Seed Level Mappings
  for (const mapping of levelMappings) {
    await prisma.levelMap.upsert({
      where: {
        companyName_companyLevel: {
          companyName: mapping.companyName,
          companyLevel: mapping.companyLevel
        }
      },
      update: {},
      create: {
        companyName: mapping.companyName,
        companyLevel: mapping.companyLevel,
        standardLevelTier: mapping.standardLevelTier,
        levelRank: mapping.levelRank
      }
    });
  }
  console.log('Seeded level maps.');

  // 3. Seed Salaries
  console.log(`Inserting ${generatedMockSalaries.length} salary records...`);
  for (const s of generatedMockSalaries) {
    const companyId = companyMap.get(s.companyName);
    if (!companyId) continue;

    const base = s.base;
    const stock = s.stock;
    const bonus = s.bonus;
    const totalCompensation = base + (stock / 4) + bonus;

    await prisma.salaryRecord.create({
      data: {
        companyId,
        title: s.title,
        level: s.level,
        standardLevelTier: s.tier,
        location: s.location,
        baseSalary: base,
        stockGrant: stock,
        bonus: bonus,
        totalCompensation,
        status: 'VERIFIED'
      }
    });
  }

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
