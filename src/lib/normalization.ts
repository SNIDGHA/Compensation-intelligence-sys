export function normalizeCompanyName(name: string): string {
  const cleanName = name.trim().toLowerCase();

  // Basic normalization dictionary for top tech companies
  if (cleanName.includes('google')) return 'Google';
  if (cleanName.includes('meta') || cleanName.includes('facebook')) return 'Meta';
  if (cleanName.includes('microsoft')) return 'Microsoft';
  if (cleanName.includes('apple')) return 'Apple';
  if (cleanName.includes('netflix')) return 'Netflix';
  if (cleanName.includes('amazon')) return 'Amazon';
  if (cleanName.includes('stripe')) return 'Stripe';
  if (cleanName.includes('uber')) return 'Uber';
  if (cleanName.includes('airbnb')) return 'Airbnb';
  if (cleanName.includes('salesforce')) return 'Salesforce';
  if (cleanName.includes('coinbase')) return 'Coinbase';
  if (cleanName.includes('palantir')) return 'Palantir';
  if (cleanName.includes('nvidia')) return 'Nvidia';

  // Fallback: title case the name (e.g. "acme corp" -> "Acme Corp")
  // Strip trailing common suffixes like inc, llc, corp, co
  const suffixPattern = /\b(inc|llc|corp|co|ltd|incorporated|corporation|limited)\b\.?/gi;
  const stripped = name.replace(suffixPattern, '').trim();

  if (!stripped) return name;

  return stripped
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function calculateTotalCompensation(base: number, stock: number, bonus: number): number {
  const annualBase = Math.max(0, base);
  const annualStock = Math.max(0, stock) / 4; // Standard Levels.fyi 4-year vesting annualization
  const annualBonus = Math.max(0, bonus);
  return annualBase + annualStock + annualBonus;
}

export interface LevelTierInfo {
  tier: 'JUNIOR' | 'MID' | 'SENIOR' | 'STAFF' | 'PRINCIPAL';
  rank: number;
}

export function mapLevelToStandardTier(companyName: string, rawLevel: string): LevelTierInfo {
  const company = normalizeCompanyName(companyName).toLowerCase();
  const level = rawLevel.trim().toUpperCase();

  // Exact mappings for major companies
  if (company === 'google') {
    if (level === 'L3') return { tier: 'JUNIOR', rank: 1 };
    if (level === 'L4') return { tier: 'MID', rank: 2 };
    if (level === 'L5') return { tier: 'SENIOR', rank: 3 };
    if (level === 'L6') return { tier: 'STAFF', rank: 4 };
    if (level >= 'L7' || level === 'L7' || level === 'L8' || level === 'L9' || level === 'L10') return { tier: 'PRINCIPAL', rank: 5 };
  }

  if (company === 'meta') {
    if (level === 'E3') return { tier: 'JUNIOR', rank: 1 };
    if (level === 'E4') return { tier: 'MID', rank: 2 };
    if (level === 'E5') return { tier: 'SENIOR', rank: 3 };
    if (level === 'E6') return { tier: 'STAFF', rank: 4 };
    if (level >= 'E7' || level === 'E7' || level === 'E8' || level === 'E9') return { tier: 'PRINCIPAL', rank: 5 };
  }

  if (company === 'microsoft') {
    const numLevel = parseInt(level, 10);
    if (!isNaN(numLevel)) {
      if (numLevel >= 59 && numLevel <= 60) return { tier: 'JUNIOR', rank: 1 };
      if (numLevel >= 61 && numLevel <= 62) return { tier: 'MID', rank: 2 };
      if (numLevel >= 63 && numLevel <= 64) return { tier: 'SENIOR', rank: 3 };
      if (numLevel >= 65 && numLevel <= 66) return { tier: 'STAFF', rank: 4 };
      if (numLevel >= 67) return { tier: 'PRINCIPAL', rank: 5 };
    }
  }

  if (company === 'apple') {
    if (level === 'ICT2') return { tier: 'JUNIOR', rank: 1 };
    if (level === 'ICT3') return { tier: 'MID', rank: 2 };
    if (level === 'ICT4') return { tier: 'SENIOR', rank: 3 };
    if (level === 'ICT5') return { tier: 'STAFF', rank: 4 };
    if (level === 'ICT6' || level === 'ICT7' || level === 'ICT8') return { tier: 'PRINCIPAL', rank: 5 };
  }

  if (company === 'amazon') {
    if (level === 'L4') return { tier: 'JUNIOR', rank: 1 };
    if (level === 'L5') return { tier: 'MID', rank: 2 };
    if (level === 'L6') return { tier: 'SENIOR', rank: 3 };
    if (level === 'L7') return { tier: 'STAFF', rank: 4 };
    if (level === 'L8' || level === 'L10') return { tier: 'PRINCIPAL', rank: 5 };
  }

  // Fallback logic using text searches for unknown levels or companies
  const lowerLevel = level.toLowerCase();

  if (
    lowerLevel.includes('principal') ||
    lowerLevel.includes('director') ||
    lowerLevel.includes('fellow') ||
    lowerLevel.includes('vp') ||
    lowerLevel.includes('l7') ||
    lowerLevel.includes('e7') ||
    lowerLevel.includes('l8') ||
    lowerLevel.includes('e8')
  ) {
    return { tier: 'PRINCIPAL', rank: 5 };
  }

  if (lowerLevel.includes('staff') || lowerLevel.includes('l6') || lowerLevel.includes('e6')) {
    return { tier: 'STAFF', rank: 4 };
  }

  if (
    lowerLevel.includes('senior') ||
    lowerLevel.includes('sr.') ||
    lowerLevel.includes('sr ') ||
    lowerLevel === 'sr' ||
    lowerLevel.includes('l5') ||
    lowerLevel.includes('e5')
  ) {
    return { tier: 'SENIOR', rank: 3 };
  }

  if (
    lowerLevel.includes('junior') ||
    lowerLevel.includes('jr.') ||
    lowerLevel.includes('jr ') ||
    lowerLevel === 'jr' ||
    lowerLevel.includes('entry') ||
    lowerLevel.includes('associate') ||
    lowerLevel.includes('intern') ||
    lowerLevel.includes('l3') ||
    lowerLevel.includes('e3')
  ) {
    return { tier: 'JUNIOR', rank: 1 };
  }

  // Default fallback if we cannot identify the level
  return { tier: 'MID', rank: 2 };
}
